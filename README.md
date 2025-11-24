# Daily Song Blog 🎵

**Share songs from Spotify to your blog with ONE TAP from your iPhone!**

No copy-pasting, no manual uploads, no opening Contentful. Just tap Share in Spotify → Done.

## How It Works

1. **Spotify App** → Tap ··· → Share → "Daily Song"
2. **iOS Shortcut** → Sends Spotify URL to your API
3. **Your API** → Fetches song metadata (title, artist, album art)
4. **Contentful** → Creates the blog post automatically
5. **Your Blog** → Updates in 30-60 seconds

## What You Need

- iPhone with iOS 14+ (for Shortcuts)
- Free Contentful account (CMS)
- Free Vercel account (hosting)
- 30 minutes for setup

## Quick Start

### 1. Clone/Download This Project

Open in VSCode and install dependencies:

```bash
npm install
```

### 2. Set Up Contentful

#### Create Account & Space
1. Go to [contentful.com](https://www.contentful.com) and sign up (free)
2. Create a new space: "Song Blog"

#### Create Content Model
1. Go to **Content model** → **Add content type**
2. Name: "Song Post"
3. API Identifier: `songPost`
4. Add these 7 fields:

| Field Name | Field ID | Type | Required | Validation |
|------------|----------|------|----------|------------|
| Title | title | Short text | ✅ | - |
| Artist | artist | Short text | ✅ | - |
| Slug | slug | Short text | ✅ | Unique, Pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$` |
| Album Cover | albumCover | Short text | ✅ | Pattern: `^https?://.*` |
| Spotify URL | spotifyUrl | Short text | ✅ | Pattern: `^https:\/\/(open\.)?spotify\.com\/track\/.*` |
| Thoughts | thoughts | Long text | ✅ | - |
| Publish Date | publishDate | Date & time | ✅ | - |

#### Get API Keys
1. Go to **Settings** → **API keys**
2. You need THREE tokens:
   - **Space ID** (copy this)
   - **Content Delivery API - access token** (copy this)
   - **Content Management API - access token** (create a new one):
     - Click "Generate personal token"
     - Name it "Blog API"
     - Copy the token (you can't see it again!)

### 3. Configure Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
# From Contentful Settings → API keys
CONTENTFUL_SPACE_ID=abc123xyz
CONTENTFUL_ACCESS_TOKEN=your_content_delivery_token
CONTENTFUL_MANAGEMENT_TOKEN=your_content_management_token

# Create a random secret (any long random string)
API_SECRET_KEY=your-super-secret-key-12345

# Leave this for now, update after deploying
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Important**: The `API_SECRET_KEY` can be any random string you create. This protects your API from unauthorized access. Generate one like:
```bash
openssl rand -base64 32
```

### 4. Test Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Test the API:
```bash
curl -X POST http://localhost:3000/api/create-post \
  -H "Content-Type: application/json" \
  -d '{
    "spotifyUrl": "https://open.spotify.com/track/7tFiyTwD0nx5a1eklYtX2J",
    "thoughts": "Testing!",
    "apiKey": "your-super-secret-key-12345"
  }'
```

If it works, you should see:
```json
{
  "success": true,
  "data": {
    "title": "Bohemian Rhapsody",
    "artist": "Queen",
    "slug": "bohemian-rhapsody",
    "url": "http://localhost:3000/song/bohemian-rhapsody"
  }
}
```

### 5. Deploy to Vercel

1. Push your code to GitHub (make sure `.env.local` is in `.gitignore`!)

2. Go to [vercel.com](https://vercel.com) and sign in with GitHub

3. Click **Add New Project** → Import your repository

4. Add environment variables in Vercel:
   - `CONTENTFUL_SPACE_ID`
   - `CONTENTFUL_ACCESS_TOKEN`
   - `CONTENTFUL_MANAGEMENT_TOKEN`
   - `API_SECRET_KEY`
   - `NEXT_PUBLIC_SITE_URL` (set to your Vercel URL: `https://your-app.vercel.app`)

5. Click **Deploy**

6. Once deployed, copy your site URL (e.g., `https://your-song-blog.vercel.app`)

### 6. Set Up iOS Shortcut

**Full instructions**: See `IOS_SHORTCUT_SETUP.md`

**Quick version:**

1. Open **Shortcuts** app on iPhone
2. Tap **+** to create new shortcut
3. Add these actions:
   - **Receive URLs from Share Sheet**
   - **Ask for Input** (prompt: "Add thoughts?")
   - **Get Contents of URL**:
     - URL: `https://your-site.vercel.app/api/create-post`
     - Method: POST
     - Headers: `Content-Type: application/json`
     - Body: JSON with spotifyUrl, thoughts, and apiKey
   - **Show Result**
4. Name it **"Daily Song"**
5. Enable it in Share Sheet for URLs

### 7. Start Posting!

1. Open Spotify
2. Find a song
3. Tap ··· → **Share**
4. Tap **Daily Song**
5. (Optional) Add thoughts
6. Done! 🎉

Your blog updates automatically in 30-60 seconds.

## Architecture

```
iPhone (Spotify)
    ↓ (Share via iOS Shortcut)
Your API (/api/create-post)
    ↓ (Fetch metadata)
Spotify oEmbed API
    ↓ (Create entry)
Contentful CMS
    ↓ (Webhook triggers redeploy)
Vercel (Your Blog)
```

## Key Features

✅ **One-tap posting** from Spotify  
✅ **Automatic metadata** (title, artist, album art)  
✅ **No manual uploads** required  
✅ **Optional thoughts** (or add later)  
✅ **Fast** - Static site generation  
✅ **Free** - All services have free tiers  
✅ **Secure** - API key authentication  

## Optional: Auto-Rebuild Webhook

Make your site rebuild instantly when you create posts:

1. In Vercel → **Settings** → **Git** → Create a **Deploy Hook**
2. Copy the webhook URL
3. In Contentful → **Settings** → **Webhooks** → **Add webhook**
4. Paste the URL
5. Select triggers: **Entry publish** and **Entry unpublish**
6. Save

Now posts appear in 10-20 seconds instead of 60!

## Adding Thoughts Later

If you skip thoughts when sharing, you can add them later:

1. Go to Contentful
2. Find your post in **Content**
3. Edit the **Thoughts** field
4. Click **Publish**
5. Your site rebuilds with the updated thoughts

## Customization Ideas

### Change Colors
Edit `app/globals.css` or component Tailwind classes

### Add Tags/Genres
1. Add a "tags" field to Contentful content model
2. Update API to accept tags
3. Add filtering to homepage

### Add Search
Install a search library like Fuse.js and add a search bar

### Add Comments
Integrate Disqus, Commento, or similar

### Add Analytics
Add Google Analytics or Plausible

## Troubleshooting

### Shortcut shows "Invalid API key"
- Double-check the API key in your shortcut matches `.env.local`
- Make sure you added the API_SECRET_KEY to Vercel environment variables

### Post created but no album art
- Check that Spotify's image CDN (`i.scdn.co`) is allowed in `next.config.js`
- Try a different song (some songs have restricted images)

### Shortcut doesn't appear in Spotify share menu
- Make sure you enabled "Show in Share Sheet" for URLs
- Restart the Shortcuts app

### API returns error
- Check Vercel logs: Vercel Dashboard → Your Project → Logs
- Verify Contentful tokens are correct
- Test the API with curl to debug

### Site doesn't update after posting
- Wait 60 seconds (default revalidation time)
- Check Contentful - is the entry published?
- Set up the webhook for instant updates

## Tech Stack

- **Frontend**: Next.js 15 (App Router, Server Components)
- **CMS**: Contentful (Content + Management APIs)
- **Styling**: Tailwind CSS
- **Hosting**: Vercel (Edge Functions, Auto-deploy)
- **Metadata**: Spotify oEmbed API (no auth required!)
- **Mobile**: iOS Shortcuts

## Project Structure

```
song-blog/
├── app/
│   ├── api/
│   │   └── create-post/
│   │       └── route.ts          # API endpoint
│   ├── song/[slug]/
│   │   └── page.tsx              # Individual song page
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Homepage
│   └── globals.css               # Global styles
├── components/
│   ├── SongCard.tsx              # Song card component
│   └── SpotifyPlayer.tsx         # Spotify embed
├── lib/
│   ├── contentful.ts             # Contentful helpers
│   └── spotify.ts                # Spotify metadata fetcher
├── IOS_SHORTCUT_SETUP.md         # Detailed shortcut guide
└── README.md                     # This file
```

## Security Notes

- **Never commit `.env.local`** to Git
- **Keep your API_SECRET_KEY secret** - it protects your API
- **Management token** gives full access - keep it secure
- Consider rate limiting the API endpoint for production

## Contributing

Want to improve this? Ideas:
- Add Android support (via Tasker or similar)
- Add batch import feature
- Add RSS feed
- Add social media previews
- Add "listening stats" dashboard

## License

MIT - Use it however you want!

---

Built with ❤️ for music lovers who want to share their daily discoveries without friction.
