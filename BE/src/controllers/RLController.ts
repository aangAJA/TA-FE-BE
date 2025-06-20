// src/controllers/readLaterController.ts
import { Request, Response } from 'express';
import { ReadLaterResponse } from '../types/RL';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


export const addToReadLater = async (req: Request, res: Response<ReadLaterResponse>) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: false,
        code: 'UNAUTHENTICATED',
        message: 'Please login first'
      });
    }

    const { storyId } = req.body;

    if (!storyId) {
      return res.status(400).json({
        status: false,
        code: 'MISSING_DATA',
        message: 'Story ID is required'
      });
    }

    // Check if story exists
    const storyExists = await prisma.story.findUnique({
      where: { id: Number(storyId) }
    });

    if (!storyExists) {
      return res.status(404).json({
        status: false,
        code: 'NOT_FOUND',
        message: 'Story not found'
      });
    }

    // Check if already in read later
    const existingItem = await prisma.readLater.findFirst({
      where: {
        userId: req.user.id,
        storyId: Number(storyId)
      }
    });

    if (existingItem) {
      return res.status(400).json({
        status: false,
        code: 'ALREADY_EXISTS',
        message: 'Story already in read later list'
      });
    }

    const readLaterItem = await prisma.readLater.create({
      data: {
        userId: req.user.id,
        storyId: Number(storyId)
      },
      include: {
        story: {
          select: {
            id: true,
            title: true,
            author: true,
            description: true,
            thumbnail: true
          }
        }
      }
    });

    return res.status(201).json({
      status: true,
      code: 'ADDED_TO_READ_LATER',
      message: 'Story added to read later',
      data: readLaterItem
    });

  } catch (error) {
    console.error('Error adding to read later:', error);
    return res.status(500).json({
      status: false,
      code: 'SERVER_ERROR',
      message: 'Internal server error'
    });
  }
};

export const getReadLaterList = async (req: Request, res: Response<ReadLaterResponse>) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: false,
        code: 'UNAUTHENTICATED',
        message: 'Please login first'
      });
    }

    const readLaterItems = await prisma.readLater.findMany({
      where: {
        userId: req.user.id
      },
      include: {
        story: {
          select: {
            id: true,
            title: true,
            author: true,
            description: true,
            thumbnail: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return res.status(200).json({
      status: true,
      code: 'READ_LATER_FETCHED',
      message: 'Read later list retrieved',
      data: readLaterItems
    });

  } catch (error) {
    console.error('Error fetching read later list:', error);
    return res.status(500).json({
      status: false,
      code: 'SERVER_ERROR',
      message: 'Internal server error'
    });
  }
};

export const removeFromReadLater = async (req: Request, res: Response<ReadLaterResponse>) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: false,
        code: 'UNAUTHENTICATED',
        message: 'Please login first'
      });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: false,
        code: 'MISSING_DATA',
        message: 'Read later item ID is required'
      });
    }

    // Check if item exists and belongs to user
    const readLaterItem = await prisma.readLater.findFirst({
      where: {
        id: Number(id),
        userId: req.user.id
      }
    });

    if (!readLaterItem) {
      return res.status(404).json({
        status: false,
        code: 'NOT_FOUND',
        message: 'Read later item not found'
      });
    }

    await prisma.readLater.delete({
      where: {
        id: Number(id)
      }
    });

    return res.status(200).json({
      status: true,
      code: 'REMOVED_FROM_READ_LATER',
      message: 'Story removed from read later'
    });

  } catch (error) {
    console.error('Error removing from read later:', error);
    return res.status(500).json({
      status: false,
      code: 'SERVER_ERROR',
      message: 'Internal server error'
    });
  }
};