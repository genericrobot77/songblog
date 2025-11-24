import { getAllPosts } from '@/lib/contentful';
import Link from 'next/link';
import Image from 'next/image';

export const revalidate = 60;

export default async function PlaylistPage() {
  const posts = await getAllPosts();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
            Back to Blog
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">My Playlist</h1>
              <p className="text-gray-600">{posts.length} songs</p>
            </div>
            
            {posts.length > 0 && (
              <Link
                href={posts[0].spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-6 py-3 rounded-full font-medium hover:bg-green-700 transition-colors"
              >
                Play in Spotify
              </Link>
            )}
          </div>

          <div className="space-y-4">
            {posts.map((post, index) => (
              <Link
                key={post.slug}
                href={`/song/${post.slug}`}
                className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="w-8 text-center text-gray-500 font-medium">
                  {index + 1}
                </div>

                <div className="relative w-16 h-16 flex-shrink-0">
                  <Image
                    src={post.albumCover}
                    alt={post.title}
                    fill
                    className="object-cover rounded"
                    sizes="64px"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 truncate">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600 truncate">{post.artist}</p>
                </div>

                <div className="text-sm text-gray-500 hidden sm:block">
                  {new Date(post.publishDate).toLocaleDateString()}
                </div>
              </Link>
            ))}
          </div>

          {posts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">No songs yet!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}