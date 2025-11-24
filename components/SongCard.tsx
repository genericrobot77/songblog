import Link from 'next/link';
import Image from 'next/image';
import { SongPost } from '@/lib/contentful';

export default function SongCard({ post }: { post: SongPost }) {
  const formattedDate = new Date(post.publishDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link href={`/song/${post.slug}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
        <div className="relative h-64 w-full">
          <Image
            src={post.albumCover}
            alt={`${post.title} by ${post.artist}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-1 text-gray-900">{post.title}</h2>
          <p className="text-gray-600 mb-3">{post.artist}</p>
          <p className="text-gray-500 text-sm mb-4">{formattedDate}</p>
          {post.thoughts && post.thoughts !== 'No thoughts added yet.' && (
            <p className="text-gray-700 line-clamp-3">{post.thoughts}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
