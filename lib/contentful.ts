import { createClient } from 'contentful';
import { createClient as createManagementClient } from 'contentful-management';

// Read client (for displaying blog posts)
const contentfulClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || '',
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || '',
});

// Management client (for creating posts via API)
const managementClient = createManagementClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN || '',
});

export interface SongPost {
  title: string;
  artist: string;
  slug: string;
  albumCover: string;
  spotifyUrl: string;
  thoughts: string;
  publishDate: string;
}

// Fetch all song posts
export async function getAllPosts(): Promise<SongPost[]> {
  const response = await contentfulClient.getEntries({
    content_type: 'songPost',
    order: ['-fields.publishDate'],
  });

  return response.items.map((item: any) => {
    // Extract text from Rich Text field
    const thoughtsText = item.fields.thoughts?.content?.[0]?.content?.[0]?.value || '';
    
    return {
      title: item.fields.title,
      artist: item.fields.artist,
      slug: item.fields.slug,
      albumCover: item.fields.albumCover,
      spotifyUrl: item.fields.spotifyUrl,
      thoughts: thoughtsText,
      publishDate: item.fields.publishDate,
    };
  });
}

// Fetch a single post by slug
export async function getPostBySlug(slug: string): Promise<SongPost | null> {
  const response = await contentfulClient.getEntries({
    content_type: 'songPost',
    'fields.slug': slug,
    limit: 1,
  });

  if (response.items.length === 0) return null;

  const item = response.items[0] as any;
  
  // Extract text from Rich Text field
  const thoughtsText = item.fields.thoughts?.content?.[0]?.content?.[0]?.value || '';
  
  return {
    title: item.fields.title,
    artist: item.fields.artist,
    slug: item.fields.slug,
    albumCover: item.fields.albumCover,
    spotifyUrl: item.fields.spotifyUrl,
    thoughts: thoughtsText,
    publishDate: item.fields.publishDate,
  };
}

// Create a new song post in Contentful
export async function createSongPost(data: {
  title: string;
  artist: string;
  slug: string;
  albumCover: string;
  spotifyUrl: string;
  thoughts?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const space = await managementClient.getSpace(process.env.CONTENTFUL_SPACE_ID || '');
    const environment = await space.getEnvironment('master');

    // Create the entry
    const entry = await environment.createEntry('songPost', {
      fields: {
        title: {
          'en-US': data.title,
        },
        artist: {
          'en-US': data.artist,
        },
        slug: {
          'en-US': data.slug,
        },
        albumCover: {
          'en-US': data.albumCover,
        },
        spotifyUrl: {
          'en-US': data.spotifyUrl,
        },
        thoughts: {
          'en-US': {
            nodeType: 'document',
            data: {},
            content: [
              {
                nodeType: 'paragraph',
                data: {},
                content: [
                  {
                    nodeType: 'text',
                    value: data.thoughts || 'No thoughts added yet.',
                    marks: [],
                    data: {},
                  },
                ],
              },
            ],
          },
        },
        publishDate: {
          'en-US': new Date().toISOString(),
        },
      },
    });

    // Publish the entry
    await entry.publish();

    return { success: true };
  } catch (error: any) {
    console.error('Error creating Contentful entry:', error);
    return { success: false, error: error.message };
  }
}

// Get Spotify embed URL
export function getSpotifyEmbedUrl(spotifyUrl: string): string {
  const trackId = spotifyUrl.match(/track\/([a-zA-Z0-9]+)/)?.[1];
  if (!trackId) return '';
  return `https://open.spotify.com/embed/track/${trackId}`;
}