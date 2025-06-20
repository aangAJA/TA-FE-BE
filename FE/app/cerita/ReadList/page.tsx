// app/cerita/ReadLater/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

interface Story {
  id: string;
  title: string;
  author: string;
  description: string;
  createdAt: string;
  contentFile: string;
}

interface ReadLaterItem {
  id: number;
  story: Story;
  createdAt: string;
}

export default function ReadLaterPage() {
  const [readLaterItems, setReadLaterItems] = useState<ReadLaterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchReadLaterList();
  }, []);

  const fetchReadLaterList = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/');
        return;
      }

      const response = await fetch('http://localhost:12/ReadLater/RL', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch read later list');
      }

      const data = await response.json();
      if (data.status && data.data) {
        setReadLaterItems(data.data);
      } else {
        throw new Error(data.message || 'Invalid response format');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch read later list');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromReadLater = (readLaterId: number) => {
    confirmAlert({
      title: 'Confirm Removal',
      message: 'Are you sure you want to remove this story from your read later list?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              const token = localStorage.getItem('token');
              if (!token) {
                router.push('/');
                return;
              }

              const response = await fetch(`http://localhost:12/ReadLater/RL/${readLaterId}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });

              const data = await response.json();

              if (!response.ok) {
                throw new Error(data.message || 'Failed to remove from read later');
              }

              fetchReadLaterList();
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Failed to remove from read later');
            }
          }
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ]
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading your read later list...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Read Later</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => router.push('/cerita/dashboard')}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Back to Dashboard
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {readLaterItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Your read later list is empty.</p>
            <button
              onClick={() => router.push('/cerita/dashboard')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Browse Stories
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {readLaterItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2 text-gray-800">{item.story.title}</h2>
                  <p className="text-gray-600 mb-1">By {item.story.author}</p>
                  <p className="text-sm text-gray-500 mb-4">Saved on {formatDate(item.createdAt)}</p>
                  <p className="text-gray-700 mb-4 line-clamp-3">{item.story.description}</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => router.push(`/cerita/storiesPage/${item.story.id}`)}
                      className="flex-1 text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Read
                    </button>
                    <button
                      onClick={() => handleRemoveFromReadLater(item.id)}
                      className="flex-1 text-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}