import { NextRequest, NextResponse } from 'next/server';
import { getThanksgivingTasks, updateThanksgivingTask } from '@/lib/thanksgiving';

export const dynamic = 'force-dynamic';

/**
 * GET /api/thanksgiving-planning
 * Fetch all thanksgiving tasks
 */
export async function GET() {
  try {
    const tasks = await getThanksgivingTasks();
    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Error in GET /api/thanksgiving-planning:', error);
    return NextResponse.json(
      { error: 'Failed to fetch thanksgiving tasks' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/thanksgiving-planning
 * Update a thanksgiving task assignment
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.id || !body.updatedBy) {
      return NextResponse.json(
        { error: 'Missing required fields: id, updatedBy' },
        { status: 400 }
      );
    }

    // Update the task
    const updatedTask = await updateThanksgivingTask({
      id: body.id,
      lead: body.lead,
      volunteers: body.volunteers,
      slotsNeeded: body.slotsNeeded,
      notes: body.notes,
      updatedBy: body.updatedBy,
    });

    return NextResponse.json({ task: updatedTask });
  } catch (error) {
    console.error('Error in POST /api/thanksgiving-planning:', error);
    return NextResponse.json(
      { error: 'Failed to update thanksgiving task' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/thanksgiving-planning
 * Create a new thanksgiving task (extras/misc)
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.task || !body.day || !body.section || !body.updatedBy) {
      return NextResponse.json(
        { error: 'Missing required fields: task, day, section, updatedBy' },
        { status: 400 }
      );
    }

    const { createThanksgivingTask } = await import('@/lib/thanksgiving');
    
    // Create the task
    const newTask = await createThanksgivingTask({
      task: body.task,
      day: body.day,
      time: body.time || '',
      section: body.section,
      lead: body.lead,
      volunteers: body.volunteers || [],
      slotsNeeded: body.slotsNeeded || 0,
      notes: body.notes,
      updatedBy: body.updatedBy,
    });

    return NextResponse.json({ task: newTask });
  } catch (error) {
    console.error('Error in PUT /api/thanksgiving-planning:', error);
    return NextResponse.json(
      { error: 'Failed to create thanksgiving task' },
      { status: 500 }
    );
  }
}
