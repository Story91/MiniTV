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
    
    // Zamiast czekać na zakończenie zadania, natychmiast zwróć ID zadania
    // Klient będzie odpytywał endpoint /api/task-status/[id] aby sprawdzić status
    return NextResponse.json({
      status: 'PENDING',
      taskId: imageToVideo.id,
      progress: 0,
      logs: ['Task initiated successfully, check status using the taskId']
    });

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