# Docker Setup for Song Blog

## Prerequisites

- Docker Desktop installed and running
- The song-blog project files

## Setup Steps

### 1. Set Up Environment Variables

First, create your `.env.local` file:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` with your Contentful credentials:
```env
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_delivery_token
CONTENTFUL_MANAGEMENT_TOKEN=your_management_token
API_SECRET_KEY=your_secret_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 2. Build and Run with Docker Compose (Easiest)

```bash
docker-compose up --build
```

This will:
- Build the Docker image
- Install all dependencies
- Start the development server
- Make it available at http://localhost:3000

**To stop:** Press `Ctrl+C` in the terminal

**To run in background:**
```bash
docker-compose up -d
```

**To stop background process:**
```bash
docker-compose down
```

### 3. Alternative: Using Docker Directly

**Build the image:**
```bash
docker build -t song-blog .
```

**Run the container:**
```bash
docker run -p 3000:3000 -v $(pwd):/app -v /app/node_modules --env-file .env.local song-blog
```

### 4. Access Your Blog

Open your browser and go to:
```
http://localhost:3000
```

## Common Docker Commands

**View running containers:**
```bash
docker ps
```

**View logs:**
```bash
docker-compose logs -f
```

**Restart the container:**
```bash
docker-compose restart
```

**Rebuild after changes:**
```bash
docker-compose up --build
```

**Enter the container shell:**
```bash
docker-compose exec app sh
```

**Install new npm packages:**
```bash
docker-compose exec app npm install package-name
```

## Troubleshooting

### Port 3000 already in use
```bash
# Change port in docker-compose.yml:
ports:
  - "3001:3000"  # Use port 3001 instead
```

### Changes not reflecting
- Make sure volumes are mounted correctly
- Try rebuilding: `docker-compose up --build`

### Permission issues
```bash
# On Mac/Linux, you might need to fix permissions:
sudo chown -R $USER:$USER .
```

### Container keeps restarting
- Check logs: `docker-compose logs`
- Verify `.env.local` exists and has correct values
- Make sure Contentful tokens are valid

## VSCode Integration

Install the **Docker extension** in VSCode for:
- Easy container management
- View logs
- Attach to running containers

## Development Workflow

1. **Start Docker Desktop**
2. **Open project in VSCode**
3. **Open terminal and run:**
   ```bash
   docker-compose up
   ```
4. **Edit files** - changes auto-reload
5. **View at** http://localhost:3000

## Production Build (for testing)

```bash
# Build production image
docker build -t song-blog:prod --target production .

# Run production build
docker run -p 3000:3000 --env-file .env.local song-blog:prod
```

## Notes

- The `node_modules` folder is managed inside the container
- Changes to code files will hot-reload automatically
- If you add new npm packages, rebuild: `docker-compose up --build`
- `.env.local` is NOT copied into the image (security)
