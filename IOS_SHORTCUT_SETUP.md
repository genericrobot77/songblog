# iOS Shortcut Setup

This shortcut allows you to share songs directly from Spotify to your blog with one tap!

## How It Works

1. You tap "Share" on a Spotify song
2. Select "Daily Song" from the share menu
3. (Optional) Add your thoughts
4. The shortcut sends the Spotify URL to your API
5. Your blog automatically fetches song info and creates the post

## Creating the Shortcut

### Step 1: Open Shortcuts App

1. Open the **Shortcuts** app on your iPhone
2. Tap the **+** button (top right) to create a new shortcut

### Step 2: Build the Shortcut

Add these actions in order:

#### Action 1: Receive Input
1. Tap **Add Action**
2. Search for "Receive"
3. Select **Receive [Any] input from [Share Sheet]**
4. Change "Any" to **URLs**
5. Tap "Share Sheet" and enable "Show in Share Sheet"
6. Under "Share Sheet Types" enable **URLs**

#### Action 2: Ask for Input (Optional - for thoughts)
1. Tap **+** to add another action
2. Search for "Ask for Input"
3. Select **Ask for Input**
4. Set the prompt to: "Add thoughts about this song? (optional)"
5. Change input type to **Text**

#### Action 3: Get Contents of URL
1. Tap **+** to add another action
2. Search for "Get Contents"
3. Select **Get Contents of URL**
4. Tap **URL** and clear it
5. Configure the request:
   - **URL**: `https://your-site.vercel.app/api/create-post`
   - **Method**: POST
   - **Headers**:
     - `Content-Type`: `application/json`
   - **Request Body**: JSON (see below)

#### JSON Request Body:
Tap "Request Body" and select "JSON". Then build this structure using variables:

```json
{
  "spotifyUrl": "[Shortcut Input]",
  "thoughts": "[Provided Input]",
  "apiKey": "YOUR_API_SECRET_KEY"
}
```

To add variables:
- Tap in the text field where you want to insert a variable
- Tap the variable button (looks like a pill)
- Select the appropriate variable:
  - For spotifyUrl: Select "Shortcut Input"
  - For thoughts: Select "Provided Input"
  - For apiKey: Type your actual API key (you'll set this later)

#### Action 4: Show Result
1. Tap **+** to add another action
2. Search for "Show Result"
3. Select **Show Result**
4. Set it to show: **Contents of URL**

### Step 3: Name Your Shortcut

1. Tap "Done"
2. Long-press on the shortcut
3. Tap "Rename"
4. Name it **"Daily Song"** or **"Post Song"**

### Step 4: Configure Share Sheet Icon (Optional)

1. Long-press the shortcut
2. Tap "Details"
3. Tap the icon to customize color/glyph
4. Recommended: Use music note icon 🎵

## Using the Shortcut

### From Spotify:
1. Find a song
2. Tap the three dots (···)
3. Tap **Share**
4. Scroll down and tap **Daily Song** (or whatever you named it)
5. (Optional) Type your thoughts
6. Tap **Done**

The shortcut will:
- Send the Spotify URL to your API
- Your API fetches song metadata (title, artist, album art)
- Creates a post in Contentful
- Shows you a success message!

## Important Configuration

Before using the shortcut, you need to:

1. **Deploy your site to Vercel** (see main README)
2. **Update the shortcut URL**:
   - Edit the shortcut
   - Change `https://your-site.vercel.app` to your actual Vercel URL
3. **Add your API key**:
   - Get your `API_SECRET_KEY` from your `.env.local` file
   - Edit the shortcut
   - Replace `YOUR_API_SECRET_KEY` with your actual key

## Troubleshooting

**"The operation couldn't be completed" error:**
- Check that your API URL is correct
- Verify your API key matches your `.env.local`
- Make sure your site is deployed and running

**"Invalid API key" response:**
- Double-check the API key in your shortcut matches `.env.local`

**Shortcut doesn't appear in Spotify's share menu:**
- Make sure you configured "Share Sheet Types" to accept URLs
- Restart the Shortcuts app

**No response or hangs:**
- Check your internet connection
- Verify your Vercel site is online
- Check Vercel logs for API errors

## Advanced: Skip the Thoughts Prompt

If you want truly one-tap posting (no prompt):

1. Edit the shortcut
2. Delete the "Ask for Input" action
3. In the JSON body, change:
   ```json
   "thoughts": ""
   ```
   (just an empty string)

You can always add thoughts later by editing the post in Contentful!

## Testing

Test your shortcut:
1. Open Spotify
2. Find any song
3. Share it using your shortcut
4. Check your blog - the post should appear!

The first time might take 30-60 seconds for your site to rebuild. After that, new posts appear almost instantly!
