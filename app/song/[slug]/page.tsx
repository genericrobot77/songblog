import { getPostBySlug, getAllPosts } from '@/lib/contentful';
import SpotifyPlayer from '@/components/SpotifyPlayer';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function SongPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const formattedDate = new Date(post.publishDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Back to all songs
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Album Cover */}
          <div className="relative h-96 w-full">
            <Image
              src={post.albumCover}
              alt={`${post.title} by ${post.artist}`}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>

          <div className="p-8">
            {/* Song Title & Artist */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{post.title}</h1>
              <p className="text-xl text-gray-700 mb-2">{post.artist}</p>
              <p className="text-gray-600">{formattedDate}</p>
            </div>

            {/* Spotify Player */}
            <div className="mb-8">
              <SpotifyPlayer spotifyUrl={post.spotifyUrl} />
            </div>

            {/* Thoughts */}
            {post.thoughts && post.thoughts !== 'No thoughts added yet.' && (
              <div className="prose prose-lg max-w-none">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">My Thoughts</h2>
                <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {post.thoughts}
                </div>
              </div>
            )}
          </div>
        </article>
      </main>
    </div>
  );
}