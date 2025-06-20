// app/api/cerita/stories/[id]/route.ts
import { NextResponse } from 'next/server';
import {prisma} from '../../../lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Ensure the ID is a valid number
    if (isNaN(Number(id))) {
      return NextResponse.json(
        { status: false, message: 'Invalid story ID' },
        { status: 400 }
      );
    }

    const story = await prisma.story.findUnique({
      where: { id: Number(id) }
    });

    if (!story) {
      return NextResponse.json(
        { status: false, message: 'Story not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: true,
      data: story,
      message: 'Story details retrieved'
    });
  } catch (error) {
    return NextResponse.json(
      { 
        status: false, 
        message: `There is an error. ${error instanceof Error ? error.message : String(error)}` 
      },
      { status: 500 }
    );
  }
}