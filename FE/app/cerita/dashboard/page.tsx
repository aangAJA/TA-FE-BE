// app/dashboard/page.tsx
"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import StoryCard from './components/StoryCard';
import SearchBar from './components/SearchBar';
import { debounce } from '@/lib/debounce';

interface Story {
  id: string;
  title: string;
  author: string;
  description: string;
  createdAt: string;
  contentFile: string;
}

export default function Dashboard() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  // Debounced fetch function
  const debouncedFetchStories = useCallback(
    debounce((query: string) => {
      fetchStories(query);
    }, 500), // 500ms delay
    []
  );

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }

    // Fetch initial stories
    fetchStories();
  }, []);

  const fetchStories = async (query = '') => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      let url = 'http://localhost:12/stories';
      if (query) {
        url += `?search=${encodeURIComponent(query)}`;
      }

      const response = await fetch(url, {
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

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    debouncedFetchStories(value);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (loading && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Baca-Baca</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 text-black">
        <div className="mb-6">
          <SearchBar 
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>

        {stories.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">No stories found. Try a different search.</p>
          </div>
        )}
      </main>
    </div>
  );
}