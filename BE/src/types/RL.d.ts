// src/types/readLaterTypes.ts
export interface ReadLaterItem {
    id: number;
    userId: number;
    storyId: number;
    createdAt: Date;
    updatedAt: Date;
    story?: {
      id: number;
      title: string;
      author: string;
      description: string;
      thumbnail: string;
    };
  }
  
  export interface ReadLaterResponse {
    status: boolean;
    code: string;
    message: string;
    data?: ReadLaterItem | ReadLaterItem[];
  }