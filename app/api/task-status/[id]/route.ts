import { NextRequest, NextResponse } from 'next/server';
import RunwayML from '@runwayml/sdk';

const client = new RunwayML({
  apiKey: process.env.RUNWAY_API_KEY || ''
});

// Definiujemy typy dla rezultatu zadania
interface TaskResult {
  status: string;
  logs: string[];
  progress: number;
  videoUrl?: string;
  error?: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const taskId = params.id;
  
  if (!taskId) {
    console.error('Task ID is missing');
    return NextResponse.json(
      { 
        status: 'FAILED', 
        error: 'Task ID is missing',
        logs: ['Task ID is missing'] 
      },
      { status: 400 }
    );
  }

  try {
    console.log(`Checking status for task: ${taskId}`);
    
    // Get the current status of the task
    const task = await client.tasks.retrieve(taskId);
    console.log('Task status:', task.status);
    console.log('Full task response:', task);
    
    // Construct a result based on the task state
    let result: TaskResult = {
      status: task.status,
      logs: [`Task status: ${task.status}`],
      progress: 0
    };
    
    // Add additional details based on the task status
    switch (task.status) {
      case 'SUCCEEDED':
        result = {
          ...result,
          status: 'SUCCEEDED',
          videoUrl: task.output && task.output[0] ? task.output[0] : undefined,
          progress: 100,
          logs: ['Video generation completed successfully!']
        };
        break;
        
      case 'FAILED':
        result = {
          ...result,
          status: 'FAILED',
          error: task.failure || 'Video generation failed',
          logs: ['Video generation failed', task.failure || '']
        };
        break;
        
      case 'RUNNING':
        const progress = task.progress ? Math.round(task.progress * 100) : 50;
        result = {
          ...result,
          status: 'PROCESSING',
          progress,
          logs: [`Processing: ${progress}% complete`]
        };
        break;
        
      case 'PENDING':
        result = {
          ...result,
          status: 'PENDING',
          progress: 5,
          logs: ['Task is pending, waiting to start...']
        };
        break;
        
      case 'THROTTLED':
        result = {
          ...result,
          status: 'THROTTLED',
          progress: 0,
          logs: ['Task is throttled, waiting for resources...']
        };
        break;
        
      case 'CANCELLED':
        result = {
          ...result,
          status: 'CANCELLED',
          progress: 0,
          logs: ['Task was cancelled']
        };
        break;
        
      default:
        result = {
          ...result,
          status: task.status,
          progress: 0,
          logs: [`Unknown status: ${task.status}`]
        };
    }
    
    console.log('Returning task result:', result);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error retrieving task status:', error);
    return NextResponse.json(
      {
        status: 'FAILED',
        error: error instanceof Error ? error.message : 'Failed to retrieve task status',
        logs: ['An unexpected error occurred during status check']
      },
      { status: 500 }
    );
  }
} 