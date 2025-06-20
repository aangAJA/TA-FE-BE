// app/dashboard/components/StoryCard.tsx
"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Story {
  id: string;
  title: string;
  author: string;
  description: string;
  createdAt: string;
  contentFile: string;
}

export default function StoryCard({ story }: { story: Story }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  
  const formattedDate = new Date(story.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleAddToReadLater = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/');
        return;
      }

      const response = await fetch('http://localhost:12/readlater', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ storyId: story.id })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add to read later');
      }

      alert('Story added to your read later list!');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to add to read later');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">{story.title}</h2>
        <p className="text-gray-600 mb-1">By {story.author}</p>
        <p className="text-sm text-gray-500 mb-4">Posted on {formattedDate}</p>
        <p className="text-gray-700 mb-4 line-clamp-3">{story.description}</p>
        <div className="flex space-x-2 mt-4">
          <Link
            href={`/cerita/storiesPage/${story.id}`}
            className="flex-1 text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
          >
            Read Story
          </Link>
          <button
            onClick={handleAddToReadLater}
            disabled={isSaving}
            className={`flex-1 text-center px-4 py-2 rounded-md transition-colors duration-300 ${
              isSaving 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {isSaving ? 'Saving...' : 'Save for Later'}
          </button>
        </div>
      </div>
    </div>
  );
}