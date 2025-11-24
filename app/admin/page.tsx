'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const [spotifyUrl, setSpotifyUrl] = useState('');
  const [thoughts, setThoughts] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/create-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spotifyUrl,
          thoughts,
          apiKey,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(`Success! Post created: ${data.data.title} by ${data.data.artist}`);
        setSpotifyUrl('');
        setThoughts('');
        
        setTimeout(() => {
          router.push(`/song/${data.data.slug}`);
        }, 2000);
      } else {
        setError(`Error: ${data.error}`);
      }
    } catch (err: any) {
      setError(`Failed to create post: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add Song to Blog</h1>
          <p className="text-gray-600 mb-8">Paste a Spotify link and add your thoughts</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="spotifyUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Spotify URL *
              </label>
              <input
                type="url"
                id="spotifyUrl"
                required
                value={spotifyUrl}
                onChange={(e) => setSpotifyUrl(e.target.value)}
                placeholder="https://open.spotify.com/track/..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="mt-2 text-sm text-gray-500">
                In Spotify: Click ··· → Share → Copy Song Link
              </p>
            </div>

            <div>
              <label htmlFor="thoughts" className="block text-sm font-medium text-gray-700 mb-2">
                Your Thoughts (optional)
              </label>
              <textarea
                id="thoughts"
                value={thoughts}
                onChange={(e) => setThoughts(e.target.value)}
                rows={6}
                placeholder="What do you think about this song? Why did you choose it today?"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
                API Key *
              </label>
              <input
                type="password"
                id="apiKey"
                required
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Your API secret key"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="mt-2 text-sm text-gray-500">
                Get this from your .env.local file (API_SECRET_KEY)
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating Post...' : 'Add Song to Blog'}
            </button>
          </form>

          {message && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800">{message}</p>
              <p className="text-green-600 text-sm mt-1">Redirecting to post...</p>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">How to Get Spotify URLs</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Desktop Spotify App:</h3>
                <ol className="list-decimal list-inside space-y-1 text-gray-700">
                  <li>Find the song you want to share</li>
                  <li>Click the three dots (···) next to the song</li>
                  <li>Hover over "Share"</li>
                  <li>Click "Copy Song Link"</li>
                  <li>Paste it in the form above</li>
                </ol>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Spotify Web Player:</h3>
                <ol className="list-decimal list-inside space-y-1 text-gray-700">
                  <li>Go to open.spotify.com</li>
                  <li>Find your song and play it</li>
                  <li>Click the three dots (···)</li>
                  <li>Click "Share" → "Copy Song Link"</li>
                  <li>Paste it in the form above</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a href="/" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Back to Blog
          </a>
        </div>
      </div>
    </div>
  );
}
