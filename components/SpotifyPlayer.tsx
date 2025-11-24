import { getSpotifyEmbedUrl } from '@/lib/contentful';

export default function SpotifyPlayer({ spotifyUrl }: { spotifyUrl: string }) {
  const embedUrl = getSpotifyEmbedUrl(spotifyUrl);

  if (!embedUrl) {
    return (
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <p className="text-gray-600">Invalid Spotify URL</p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-lg">
      <iframe
        src={embedUrl}
        width="100%"
        height="352"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="rounded-lg"
      ></iframe>
    </div>
  );
}
