import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { BASE_URL } from "../global";
import fs from "fs";
import path from "path";
import mammoth from "mammoth"; // For .docx file extraction
import pdf from "pdf-parse"; // For PDF file extraction
import { verifyToken } from "../middlewares/auth";
import { JwtPayload } from '../types/express';


const prisma = new PrismaClient({ errorFormat: "pretty" });

// Helper function to extract text from different file types
async function extractTextFromFile(filePath: string, originalname: string): Promise<string> {
    const ext = path.extname(originalname).toLowerCase();
    
    try {
        if (ext === '.txt') {
            return fs.promises.readFile(filePath, 'utf-8');
        } else if (ext === '.docx') {
            const result = await mammoth.extractRawText({ path: filePath });
            return result.value;
        } else if (ext === '.pdf') {
            const dataBuffer = fs.readFileSync(filePath);
            const data = await pdf(dataBuffer);
            return data.text;
        } else {
            throw new Error('Unsupported file format');
        }
    } catch (error) {
        throw new Error(`Error extracting text: ${error}`);
    }
}

export const getAllStories = async (request: Request, response: Response) => {
    try {
        const { search } = request.query;

        const allStories = await prisma.story.findMany({
            where: { 
                OR: [
                    { title: { contains: search?.toString() || "" } },
                    { author: { contains: search?.toString() || "" } }
                ]
            },
            orderBy: { createdAt: 'desc' }
        });

        // Transformasi data yang lebih bersih
        const storiesWithFilename = allStories.map(({ contentText, ...rest }) => ({
            ...rest,
            contentFile: rest.contentFile // Ini sudah berisi nama file
        }));

        return response.json({
            status: true,
            data: storiesWithFilename,
            message: `Stories have been retrieved`
        }).status(200);
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            })
            .status(400);
    }
};

export const getStoryID = async (request: Request, response: Response) => {
    try {
        const { id } = request.params;

        const story = await prisma.story.findUnique({
            where: { id: Number(id) }
        });

        if (!story) {
            return response.status(404).json({
                status: false,
                message: 'Story not found'
            });
        }

        return response.json({
            status: true,
            data: story,
            message: `Story details retrieved`
        }).status(200);
    } catch (error) {
        return response
            .json({
                status: false,
                message: `There is an error. ${error}`
            })
            .status(400);
    }
};

export const createStory = [
    verifyToken, // Tambahkan middleware verifikasi token
    async (request: Request, response: Response) => {
        try {
            const { title, author, description } = request.body;
            const userId = request.user?.id; // Dapatkan ID user dari token

            // Validasi autentikasi
            if (!userId) {
                return response.status(401).json({
                    status: false,
                    message: 'User tidak terautentikasi'
                });
            }

            // Convert userId to number and validate
            const userIdNumber = Number(userId);
            if (isNaN(userIdNumber)) {
                return response.status(400).json({
                    status: false,
                    message: 'Invalid user ID format',
                    error: 'INVALID_USER_ID'
                });
            }

            // Validate that the user exists in the database
            const userExists = await prisma.user.findUnique({
                where: { id: userIdNumber }
            });

            if (!userExists) {
                return response.status(404).json({
                    status: false,
                    message: 'User not found. Please login again.',
                    error: 'USER_NOT_FOUND'
                });
            }

            // Validasi input fields
            if (!title?.trim() || !author?.trim() || !description?.trim()) {
                return response.status(400).json({
                    status: false,
                    message: 'Title, author, and description are required'
                });
            }

            // Validasi file upload
            if (!request.files) {
                return response.status(400).json({
                    status: false,
                    message: 'Thumbnail and content file are required'
                });
            }

            const files = request.files as { [fieldname: string]: Express.Multer.File[] };
            const thumbnailFile = files['thumbnail']?.[0];
            const contentFile = files['content']?.[0];

            if (!thumbnailFile || !contentFile) {
                return response.status(400).json({
                    status: false,
                    message: 'Both thumbnail and content file are required'
                });
            }

            // Ekstrak teks dari file
            let contentText: string;
            try {
                contentText = await extractTextFromFile(contentFile.path, contentFile.originalname);
            } catch (error) {
                // Clean up files if error
                fs.unlinkSync(thumbnailFile.path);
                fs.unlinkSync(contentFile.path);
                return response.status(400).json({
                    status: false,
                    message: `Error extracting text: ${error instanceof Error ? error.message : error}`
                });
            }

            // Get the actual database column limit for contentText
            // You should adjust this based on your actual database schema
            const MAX_CONTENT_LENGTH = 65535; // For TEXT column (MySQL/PostgreSQL)
            // const MAX_CONTENT_LENGTH = 16777215; // For MEDIUMTEXT (MySQL)
            // const MAX_CONTENT_LENGTH = 4294967295; // For LONGTEXT (MySQL)
            
            // Truncate content if needed with better handling
            let truncatedContent: string;
            if (contentText.length > MAX_CONTENT_LENGTH) {
                // Leave some space for the truncation message
                const availableSpace = MAX_CONTENT_LENGTH - 50;
                truncatedContent = contentText.substring(0, availableSpace) + '...[CONTENT TRUNCATED]';
                
                console.warn(`Content truncated from ${contentText.length} to ${truncatedContent.length} characters`);
            } else {
                truncatedContent = contentText;
            }

            // Additional safety check - ensure we don't exceed the limit
            if (truncatedContent.length > MAX_CONTENT_LENGTH) {
                truncatedContent = truncatedContent.substring(0, MAX_CONTENT_LENGTH - 25) + '...[TRUNCATED]';
            }

            // Log for debugging
            console.log(`Original content length: ${contentText.length}`);
            console.log(`Final content length: ${truncatedContent.length}`);
            console.log(`User ID from token: ${userId} (type: ${typeof userId})`);
            console.log(`User ID number: ${userIdNumber}`);
            console.log(`User exists: ${userExists ? 'Yes' : 'No'}`);

            // Generate UUID
            const storyUuid = uuidv4();

            // Simpan ke database termasuk userId
            const newStory = await prisma.story.create({
                data: { 
                    uuid: storyUuid,
                    title: title.trim(),
                    author: author.trim(),
                    description: description.trim(),
                    thumbnail: thumbnailFile.filename,
                    contentFile: contentFile.filename,
                    contentText: truncatedContent,
                    userId: userIdNumber // Simpan ID user pembuat
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                }
            });

            // Pindahkan file ke storage permanen
            try {
                const thumbDest = path.join(__dirname, '../../public/story_thumbnails', thumbnailFile.filename);
                const contentDest = path.join(__dirname, '../../public/story_content', contentFile.filename);
                
                // Ensure directories exist
                const thumbDir = path.dirname(thumbDest);
                const contentDir = path.dirname(contentDest);
                
                if (!fs.existsSync(thumbDir)) {
                    fs.mkdirSync(thumbDir, { recursive: true });
                }
                if (!fs.existsSync(contentDir)) {
                    fs.mkdirSync(contentDir, { recursive: true });
                }
                
                fs.renameSync(thumbnailFile.path, thumbDest);
                fs.renameSync(contentFile.path, contentDest);
            } catch (moveError) {
                console.error('Error moving files:', moveError);
                // Rollback jika gagal pindah file
                try {
                    await prisma.story.delete({ where: { id: newStory.id } });
                } catch (rollbackError) {
                    console.error('Error rolling back story creation:', rollbackError);
                }
                throw new Error('Failed to move files to permanent storage');
            }

            return response.status(201).json({
                status: true,
                data: {
                    ...newStory,
                    thumbnailUrl: `/story_thumbnails/${newStory.thumbnail}`,
                    contentUrl: `/story_content/${newStory.contentFile}`,
                    contentLength: truncatedContent.length,
                    originalLength: contentText.length,
                    wasTruncated: contentText.length > MAX_CONTENT_LENGTH
                },
                message: 'Story created successfully'
            });

        } catch (error) {
            // Clean up uploaded files if error occurs
            if (request.files) {
                const files = request.files as { [fieldname: string]: Express.Multer.File[] };
                try {
                    if (files['thumbnail']?.[0]?.path && fs.existsSync(files['thumbnail'][0].path)) {
                        fs.unlinkSync(files['thumbnail'][0].path);
                    }
                    if (files['content']?.[0]?.path && fs.existsSync(files['content'][0].path)) {
                        fs.unlinkSync(files['content'][0].path);
                    }
                } catch (cleanupError) {
                    console.error('Error cleaning up files:', cleanupError);
                }
            }

            console.error('Error in createStory:', error);
            
            // Handle specific Prisma errors
            if ((error as any).code === 'P2000') {
                return response.status(400).json({
                    status: false,
                    message: 'Content is too long for database storage. Please use a smaller file.',
                    error: 'CONTENT_TOO_LONG'
                });
            }
            
            // Handle foreign key constraint violation
            if ((error as any).code === 'P2003') {
                return response.status(400).json({
                    status: false,
                    message: 'Invalid user reference. Please login again.',
                    error: 'INVALID_USER_REFERENCE'
                });
            }

            // Handle unique constraint violation
            if ((error as any).code === 'P2002') {
                return response.status(409).json({
                    status: false,
                    message: 'A story with this information already exists.',
                    error: 'DUPLICATE_STORY'
                });
            }
            
            return response.status(500).json({
                status: false,
                message: 'Internal server error',
                ...(process.env.NODE_ENV === 'development' && { 
                    debugError: (error as any).message,
                    errorCode: (error as any).code 
                })
            });
        }
    }
];

export const updateStory = async (request: Request, response: Response) => {
    try {
        const { id } = request.params;
        const { title, author, description } = request.body;
        
        // Validate user authentication
        if (!request.user?.id) {
            return response.status(401).json({
                status: false,
                message: 'Authentication required'
            });
        }
        
        const userId = request.user.id;

        // Find existing story with ownership check
        const existingStory = await prisma.story.findUnique({
            where: { id: Number(id) }
        });

        if (!existingStory) {
            return response.status(404).json({
                status: false,
                message: 'Story not found'
            });
        }

        // Strict ownership validation
        if (existingStory.userId !== userId) {
            console.warn(`Unauthorized edit attempt: User ${userId} tried to edit story ${id} owned by ${existingStory.userId}`);
            return response.status(403).json({
                status: false,
                message: 'You are not authorized to edit this story'
            });
        }

        const files = request.files as { [fieldname: string]: Express.Multer.File[] };
        let thumbnailFilename = existingStory.thumbnail;
        let contentFilename = existingStory.contentFile;
        let contentText = existingStory.contentText;

        // Handle thumbnail update
        if (files['thumbnail']?.[0]) {
            // Delete old thumbnail if exists
            if (existingStory.thumbnail) {
                const oldThumbnailPath = path.join(__dirname, '../../public/story_thumbnails', existingStory.thumbnail);
                if (fs.existsSync(oldThumbnailPath)) {
                    fs.unlinkSync(oldThumbnailPath);
                }
            }
            thumbnailFilename = files['thumbnail'][0].filename;
        }

        // Handle content file update
        if (files['content']?.[0]) {
            // Delete old content file if exists
            if (existingStory.contentFile) {
                const oldContentPath = path.join(__dirname, '../../public/story_content', existingStory.contentFile);
                if (fs.existsSync(oldContentPath)) {
                    fs.unlinkSync(oldContentPath);
                }
            }
            
            contentFilename = files['content'][0].filename;
            
            // Extract text from new file
            try {
                const extractedText = await extractTextFromFile(
                    files['content'][0].path, 
                    files['content'][0].originalname
                );
                const maxLength = 65535; // MySQL TEXT field limit
                contentText = extractedText.length > maxLength 
                    ? extractedText.substring(0, maxLength) + '... [CONTENT TRUNCATED]'
                    : extractedText;
            } catch (error) {
                // Clean up uploaded files if text extraction fails
                if (files['thumbnail']?.[0]) fs.unlinkSync(files['thumbnail'][0].path);
                if (files['content']?.[0]) fs.unlinkSync(files['content'][0].path);
                
                return response.status(400).json({
                    status: false,
                    message: `Error extracting text from file: ${error instanceof Error ? error.message : error}`
                });
            }
        }

        // Update story in database
        const updatedStory = await prisma.story.update({
            where: { id: Number(id) },
            data: {
                title: title || existingStory.title,
                author: author || existingStory.author,
                description: description || existingStory.description,
                thumbnail: thumbnailFilename,
                contentFile: contentFilename,
                contentText: contentText,
                updatedAt: new Date() // Explicitly set update timestamp
            }
        });

        return response.status(200).json({
            status: true,
            data: {
                id: updatedStory.id,
                title: updatedStory.title,
                author: updatedStory.author,
                description: updatedStory.description,
                thumbnail: updatedStory.thumbnail,
                updatedAt: updatedStory.updatedAt
            },
            message: 'Story has been updated successfully'
        });

    } catch (error) {
        // Clean up uploaded files if error occurs
        if (request.files) {
            const files = request.files as { [fieldname: string]: Express.Multer.File[] };
            if (files['thumbnail']?.[0]) fs.unlinkSync(files['thumbnail'][0].path);
            if (files['content']?.[0]) fs.unlinkSync(files['content'][0].path);
        }

        console.error('Error updating story:', error);
        return response.status(500).json({
            status: false,
            message: 'An error occurred while updating the story'
        });
    }
};

export const deleteStory = [
    verifyToken,
    async (request: Request, response: Response) => {
        try {
            const { id } = request.params;
            const userId = request.user?.id;
            const userRole = request.user?.role;

            // Validasi autentikasi
            if (!userId) {
                return response.status(401).json({
                    status: false,
                    message: 'User tidak terautentikasi'
                });
            }

            // Cari cerita yang akan dihapus
            const story = await prisma.story.findUnique({
                where: { id: Number(id) },
                select: {
                    id: true,
                    userId: true,
                    thumbnail: true,
                    contentFile: true
                }
            });

            if (!story) {
                return response.status(404).json({
                    status: false,
                    message: 'Cerita tidak ditemukan'
                });
            }

            // Cek otorisasi: hanya admin atau creator yang bisa menghapus
            if (userRole !== 'admin' && story.userId !== Number(userId)) {
                return response.status(403).json({
                    status: false,
                    message: 'Anda tidak memiliki akses untuk menghapus cerita ini'
                });
            }

            // Hapus file thumbnail jika ada
            if (story.thumbnail) {
                const thumbnailPath = path.join(__dirname, '../../public/story_thumbnails', story.thumbnail);
                if (fs.existsSync(thumbnailPath)) {
                    fs.unlinkSync(thumbnailPath);
                }
            }

            // Hapus file konten jika ada
            if (story.contentFile) {
                const contentPath = path.join(__dirname, '../../public/story_content', story.contentFile);
                if (fs.existsSync(contentPath)) {
                    fs.unlinkSync(contentPath);
                }
            }

            // Hapus dari database
            await prisma.story.delete({
                where: { id: Number(id) }
            });

            return response.json({
                status: true,
                message: 'Cerita berhasil dihapus'
            });

        } catch (error) {
            console.error('Error in deleteStory:', error);
            return response.status(500).json({
                status: false,
                message: 'Terjadi kesalahan server'
            });
        }
    }
];

export const getMyStories = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          status: false,
          code: 'UNAUTHENTICATED',
          message: 'Please login first' 
        });
      }
  
      const stories = await prisma.story.findMany({
        where: { userId: req.user.id },
        select: {
          id: true,
          uuid: true,
          title: true,
          author: true,
          description: true,
          thumbnail: true,
          createdAt: true,
          updatedAt: true
        },
        orderBy: { createdAt: 'desc' }
      });
  
      return res.status(200).json({
        status: true,
        code: 'STORIES_FETCHED',
        message: 'Stories retrieved successfully',
        data: stories
      });
    } catch (error) {
      console.error('Error in getMyStories:', error);
      return res.status(500).json({ 
        status: false,
        code: 'SERVER_ERROR',
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };