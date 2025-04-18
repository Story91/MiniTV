import { NextRequest, NextResponse } from 'next/server';
import RunwayML from '@runwayml/sdk';

const client = new RunwayML({
  apiKey: process.env.RUNWAY_API_KEY || ''
});

// Walidacja ratio dla poszczególnych modeli
const validateRatio = (model: string, ratio: string): string | null => {
  if (model === 'gen4_turbo') {
    const validRatios = ['1280:720', '720:1280', '1104:832', '832:1104', '960:960', '1584:672'];
    return validRatios.includes(ratio) ? ratio : '1280:720'; // domyślne ratio dla gen4_turbo
  } else if (model === 'gen3a_turbo') {
    const validRatios = ['1280:768', '768:1280'];
    return validRatios.includes(ratio) ? ratio : '1280:768'; // domyślne ratio dla gen3a_turbo
  }
  
  return null; // nieprawidłowy model
};

// Typowanie dla API
type Gen3Ratio = '1280:768' | '768:1280';
type Gen4Ratio = '1280:720' | '720:1280' | '1104:832' | '832:1104' | '960:960' | '1584:672';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received request body:', body);
    
    if (!body.imageUrl) {
      console.log('Missing image URL in request');
      return NextResponse.json({ 
        status: 'FAILED',
        error: 'Image URL is required',
        logs: ['Missing image URL']
      }, { status: 400 });
    }

    // Ustaw domyślny model, jeśli nie został określony
    const model = body.model || 'gen3a_turbo';
    console.log('Starting video generation with model:', model);
    console.log('Starting video generation with URL:', body.imageUrl);
    
    // Sprawdź czy ratio jest zgodne z modelem
    const ratio = validateRatio(model, body.ratio);
    if (!ratio) {
      console.log('Invalid model or ratio combination');
      return NextResponse.json({ 
        status: 'FAILED',
        error: 'Invalid model or ratio combination',
        logs: ['Invalid model or ratio combination']
      }, { status: 400 });
    }
    console.log('Using ratio:', ratio);

    // Przygotuj parametry zgodne z modelem
    let createParams: any = {
      model: model,
      promptImage: body.imageUrl,
      promptText: body.promptText || '',
      seed: body.seed,
      duration: body.duration || 5, // zaakceptowane wartości to 5 lub 10
    };
    
    // Dodaj ratio w zależności od modelu
    if (model === 'gen3a_turbo') {
      createParams.ratio = ratio as Gen3Ratio;
    } else if (model === 'gen4_turbo') {
      // ratio może nie być wymagane dla gen4_turbo lub mieć inne parametry
      createParams.ratio = ratio as Gen4Ratio;
    }
    
    console.log('Creating task with params:', createParams);

    // Create a new image-to-video task using the SDK
    const imageToVideo = await client.imageToVideo.create(createParams);

    console.log('Task created with ID:', imageToVideo.id);

    // Poll for task completion
    let taskComplete = false;
    let result = null;
    let attempts = 0;
    const maxAttempts = 60; // 2 minutes maximum

    while (!taskComplete && attempts < maxAttempts) {
      console.log(`Polling attempt ${attempts + 1}`);
      
      const task = await client.tasks.retrieve(imageToVideo.id);
      console.log('Task status:', task.status);

      switch (task.status) {
        case 'SUCCEEDED':
          taskComplete = true;
          result = {
            status: 'SUCCEEDED',
            videoUrl: task.output ? task.output[0] : null,
            progress: 100,
            logs: ['Video generation completed successfully!'],
            taskId: imageToVideo.id
          };
          break;

        case 'FAILED':
          taskComplete = true;
          result = {
            status: 'FAILED',
            error: task.failure || 'Video generation failed',
            logs: ['Video generation failed', task.failure || ''],
            taskId: imageToVideo.id
          };
          break;

        case 'RUNNING':
          const progress = task.progress ? Math.round(task.progress * 100) : Math.min(5 * attempts, 95);
          result = {
            status: 'PROCESSING',
            progress,
            logs: [`Processing: ${progress}% complete`],
            taskId: imageToVideo.id
          };
          break;

        default:
          console.log('Status:', task.status);
          result = {
            status: task.status,
            progress: 0,
            logs: [`Status: ${task.status}`],
            taskId: imageToVideo.id
          };
          break;
      }

      if (taskComplete) {
        console.log('Task completed with result:', result);
        break;
      }

      attempts++;
      await new Promise(resolve => setTimeout(resolve, 10000)); // 10 seconds between polls as per docs
    }

    if (!taskComplete) {
      console.log('Generation timed out');
      return NextResponse.json({
        status: 'FAILED',
        error: 'Generation timeout',
        logs: ['Video generation timed out after 2 minutes'],
        taskId: imageToVideo.id
      }, { status: 408 });
    }

    console.log('Returning final result:', result);
    return NextResponse.json(result);

  } catch (error) {
    console.error('Error generating video:', error);
    return NextResponse.json({
      status: 'FAILED',
      error: error instanceof Error ? error.message : 'Failed to generate video',
      logs: ['An unexpected error occurred during video generation']
    }, { status: 500 });
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}