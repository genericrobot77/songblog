import { NextRequest, NextResponse } from 'next/server';
import { fetchSpotifyMetadata, createSlugFromTitle } from '@/lib/spotify';
import { createSongPost } from '@/lib/contentful';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { spotifyUrl, thoughts, apiKey } = body;

    // Verify API key for security
    if (apiKey !== process.env.API_SECRET_KEY) {
      return NextResponse.json(
        { success: false, error: 'Invalid API key' },
        { status: 401 }
      );
    }

    // Validate Spotify URL
    if (!spotifyUrl || typeof spotifyUrl !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Spotify URL is required' },
        { status: 400 }
      );
    }

    // Fetch metadata from Spotify
    console.log('Fetching Spotify metadata for:', spotifyUrl);
    const metadata = await fetchSpotifyMetadata(spotifyUrl);

    if (!metadata) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch song metadata from Spotify' },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = createSlugFromTitle(metadata.title);

    // Create the post in Contentful
    console.log('Creating post in Contentful:', { title: metadata.title, slug });
    const result = await createSongPost({
      title: metadata.title,
      artist: metadata.artist,
      slug,
      albumCover: metadata.albumCover,
      spotifyUrl,
      thoughts: thoughts || 'No thoughts added yet.',
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to create post' },
        { status: 500 }
      );
    }

    // Success!
    return NextResponse.json({
      success: true,
      data: {
        title: metadata.title,
        artist: metadata.artist,
        slug,
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/song/${slug}`,
      },
    });
  } catch (error: any) {
    console.error('Error in create-post API:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// Allow GET for testing
export async function GET() {
  return NextResponse.json({
    message: 'Daily Song Blog API',
    endpoints: {
      POST: '/api/create-post',
      body: {
        spotifyUrl: 'https://open.spotify.com/track/...',
        thoughts: 'Optional thoughts about the song',
        apiKey: 'Your secret API key',
      },
    },
  });
}
