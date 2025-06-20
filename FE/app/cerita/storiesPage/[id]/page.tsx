// app/cerita/storiesPage/[id]/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Story {
  id: string;
  title: string;
  author: string;
  description: string;
  contentText: string;
  createdAt: string;
  thumbnail?: string;
}

export default function StoryPage() {
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    const fetchStory = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch(`http://localhost:12/stories/read/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch story');
        }

        const data = await response.json();
        if (data.status && data.data) {
          setStory(data.data);
        } else {
          throw new Error(data.message || 'Invalid response format');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch story');
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [id, router]);

  const handleBack = () => {
    router.push('/cerita/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading story...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Story not found</div>
      </div>
    );
  }

  const formattedDate = new Date(story.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Thumbnail URL construction
  const thumbnailUrl = story.thumbnail 
    ? `http://localhost:12/src/public/story_thumbnails/${story.thumbnail}`
    : '/default-thumbnail.jpg';

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Back to Dashboard
          </button>
          <h1 className="text-xl font-bold text-gray-900">Story Reader</h1>
          <div className="w-24"></div> {/* Spacer for balance */}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Thumbnail */}
        <div className="relative h-64 w-full mb-8 rounded-lg overflow-hidden">
          <img
            src={thumbnailUrl}
            alt={`Thumbnail for ${story.title}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = '/default-thumbnail.jpg';
            }}
          />
        </div>

        {/* Story Metadata */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{story.title}</h1>
          <div className="flex items-center justify-between">
            <p className="text-lg text-gray-600">By {story.author}</p>
            <p className="text-sm text-gray-500">Posted on {formattedDate}</p>
          </div>
        </div>

        {/* Story Content */}
        <article className="prose max-w-none">
          {story.contentText.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4 text-gray-700 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </article>
      </main>
    </div>
  );
}