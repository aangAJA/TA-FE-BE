"use client";

import Image from 'next/image';
import Link from 'next/link';

interface Story {
  id: number;
  uuid: string;
  title: string;
  author: string;
  description: string;
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
}

export default function StoryCard({ story }: { story: Story }) {
  const thumbnailUrl = story.thumbnail 
    ? `http://localhost:12/public/story_thumbnails/${story.thumbnail}`
    : '/default-thumbnail.jpg';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 w-full">
        <Image
          src={thumbnailUrl}
          alt={`Cover for ${story.title}`}
          fill
          className="object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = '/default-thumbnail.jpg';
          }}
        />
      </div>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-1 text-gray-800">{story.title}</h2>
        <p className="text-sm text-gray-600 mb-2">By {story.author}</p>
        <p className="text-gray-700 text-sm mb-4 line-clamp-2">{story.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">
            {new Date(story.createdAt).toLocaleDateString()}
          </span>
          <Link
            href={`/cerita/storiesPage/${story.uuid}`}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Read →
          </Link>
        </div>
      </div>
    </div>
  );
}