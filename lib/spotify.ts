// Utility to fetch Spotify track metadata using oEmbed API (no auth required)

export interface SpotifyMetadata {
  title: string;
  artist: string;
  albumCover: string;
  trackId: string;
}

function extractSpotifyId(url: string): string | null {
  const patterns = [
    /spotify\.com\/track\/([a-zA-Z0-9]+)/,
    /open\.spotify\.com\/track\/([a-zA-Z0-9]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
}

export async function fetchSpotifyMetadata(spotifyUrl: string): Promise<SpotifyMetadata | null> {
  try {
    const trackId = extractSpotifyId(spotifyUrl);
    if (!trackId) {
      console.error('Invalid Spotify URL');
      return null;
    }

    // Use Spotify's oEmbed API - no authentication needed!
    const oembedUrl = `https://open.spotify.com/oembed?url=https://open.spotify.com/track/${trackId}`;
    const response = await fetch(oembedUrl);
    
    if (!response.ok) {
      console.error('Failed to fetch Spotify metadata:', response.status);
      return null;
    }
    
    const data = await response.json();
    
    // Parse the title which is in format "Song Title by Artist"
    const fullTitle = data.title || '';
    const parts = fullTitle.split(' by ');
    const title = parts[0]?.trim() || '';
    const artist = parts[1]?.trim() || '';
    
    // The thumbnail_url is the album cover
    const albumCover = data.thumbnail_url || '';
    
    return {
      title,
      artist,
      albumCover,
      trackId,
    };
  } catch (error) {
    console.error('Error fetching Spotify metadata:', error);
    return null;
  }
}

export function createSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}
