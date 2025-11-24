import { getAllPosts } from '@/lib/contentful';
import SongCard from '@/components/SongCard';

export const revalidate = 60;

export default async function Home() {
  const posts = await getAllPosts();

  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Daily Song</h1>
              <p className="text-gray-600 mt-2">A song a day keeps the silence away 🎵</p>
            </div>
            <div className="flex gap-3">
              
              <a href="/playlist"
                className="bg-gray-100 text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                🎵 Playlist
              </a>
              
              <a href="/admin"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                + Add Song
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No songs posted yet. Share one from Spotify!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <SongCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600">
            Share directly from Spotify using iOS Shortcuts
          </p>
        </div>
      </footer>
    </div>
  );
}