// components/StoryCard.tsx
import Link from 'next/link'

interface Story {
  id: number
  uuid: string
  title: string
  author: string
  description: string
  thumbnail: string
  contentFile: string
  createdAt: string
}

export default function StoryCard({ story }: { story: Story }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      {story.thumbnail && (
        <div className="h-48 overflow-hidden">
          <img
            src={story.thumbnail}
            alt={story.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{story.title}</h2>
        <p className="text-gray-600 mb-1">By {story.author}</p>
        <p className="text-gray-500 text-sm mb-4">
          {new Date(story.createdAt).toLocaleDateString()}
        </p>
        <p className="text-gray-700 mb-4 line-clamp-3">{story.description}</p>
        <Link
          href={`/stories/${story.uuid}`}
          className="text-blue-500 hover:text-blue-700 font-medium"
        >
          Read More →
        </Link>
      </div>
    </div>
  )
}