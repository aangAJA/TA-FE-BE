// app/cerita/MyStory/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

interface Story {
  id: number;
  uuid: string;
  title: string;
  author: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export default function MyStoryPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchMyStories();
  }, []);

  const fetchMyStories = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/cerita/login');
        return;
      }

      const response = await fetch('http://localhost:12/stories/c/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch stories');
      }

      const data = await response.json();
      if (data.status && data.data) {
        setStories(data.data);
      } else {
        throw new Error(data.message || 'Invalid response format');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stories');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (storyId: number) => {
    router.push(`/cerita/CreateStory/edit/${storyId}`);
  };

  const handleDelete = (storyId: number) => {
    confirmAlert({
      title: 'Konfirmasi Hapus',
      message: 'Apakah Anda yakin ingin menghapus cerita ini?',
      buttons: [
        {
          label: 'Ya',
          onClick: async () => {
            try {
              const token = localStorage.getItem('token');
              if (!token) {
                router.push('/cerita/login');
                return;
              }

              const response = await fetch(`http://localhost:12/stories/delete/${storyId}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });

              const data = await response.json();

              if (!response.ok) {
                throw new Error(data.message || 'Failed to delete story');
              }

              // Refresh the story list
              fetchMyStories();
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Failed to delete story');
            }
          }
        },
        {
          label: 'Tidak',
          onClick: () => {}
        }
      ]
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Memuat cerita Anda...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">MyStory</h1>
          <button
            onClick={() => router.push('/cerita/CreateStory')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Buat Cerita Baru
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
            {error}
          </div>
        )}

        {stories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Anda belum membuat cerita apapun.</p>
            <button
              onClick={() => router.push('/cerita/CreateStory')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Buat Cerita Pertama Anda
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {stories.map((story) => (
              <div key={story.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-1">{story.title}</h2>
                    <p className="text-gray-600 mb-2">Oleh: {story.author}</p>
                    <p className="text-gray-700 mb-3">{story.description}</p>
                  </div>
                  <span className="text-sm text-gray-500 whitespace-nowrap">
                    {formatDate(story.createdAt)}
                  </span>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleUpdate(story.id)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(story.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Hapus
                  </button>
                  <button
                    onClick={() => router.push(`/cerita/storiesPage/${story.id}`)}
                    className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Baca
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}