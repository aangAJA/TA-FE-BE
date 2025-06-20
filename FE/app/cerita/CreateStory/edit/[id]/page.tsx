// app/cerita/CreateStory/edit/[id]/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

interface Story {
  id: number;
  title: string;
  author: string;
  description: string;
  thumbnail?: string;
  contentFile?: string;
}

export default function EditStoryPage() {
  const [story, setStory] = useState<Story | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: ''
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [contentFile, setContentFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    const fetchStory = async () => {
      if (!id) {
        setError('Story ID is missing');
        return;
      }
  
      try {
        setLoading(true);
        setError('');
  
        const response = await fetch(`http://localhost:12/stories/read/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch story');
        }
  
        const data = await response.json();
        if (data.status && data.data) {
          setStory(data.data);
          setFormData({
            title: data.data.title,
            author: data.data.author,
            description: data.data.description
          });
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('author', formData.author);
      formDataToSend.append('description', formData.description);
      if (thumbnail) formDataToSend.append('thumbnail', thumbnail);
      if (contentFile) formDataToSend.append('content', contentFile);

      const response = await fetch(`http://localhost:12/stories/update/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update story');
      }

      router.push('/cerita/MyStory');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update story');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    confirmAlert({
      title: 'Batalkan Perubahan',
      message: 'Apakah Anda yakin ingin membatalkan perubahan?',
      buttons: [
        {
          label: 'Ya',
          onClick: () => router.push('/cerita/MyStory')
        },
        {
          label: 'Tidak',
          onClick: () => {}
        }
      ]
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Memuat cerita...</div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error || 'Cerita tidak ditemukan'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 text-black">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Cerita</h1>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Penulis</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thumbnail Baru (Opsional)
                  {story.thumbnail && (
                    <span className="text-xs text-gray-500 ml-2">
                      Thumbnail saat ini: {story.thumbnail}
                    </span>
                  )}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  File Konten Baru (Opsional)
                  {story.contentFile && (
                    <span className="text-xs text-gray-500 ml-2">
                      File saat ini: {story.contentFile}
                    </span>
                  )}
                </label>
                <input
                  type="file"
                  accept=".txt,.pdf,.doc,.docx"
                  onChange={(e) => setContentFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}