# Mindspace

A mental-health wellness platform with multiple interactive mini-apps designed to help users relax and decompress.

## Project structure

```
brainbreak/
├── index.html          # Landing page (static)
├── homepage/           # Landing page assets (CSS/JS)
├── colorpainting/      # Draw-to-coloring-book app (Express + React/Vite)
├── soundscape/         # Ambient soundscape player (static)
└── shared/             # Shared assets
```

- **Homepage** — Static landing page with navigation to the mini-apps.
- **ColorPainting** — Draw a rough sketch and AI (Google Gemini via OpenRouter) converts it into a detailed coloring book page. Express backend + React frontend served from a unified server.
- **Soundscape** — Ambient sound mixer for relaxation.

## Running locally

The colorpainting app is the only one that needs a server:

```bash
cd colorpainting
npm install
cp .env.example .env   # then add your API key
npm run dev
```

Visit `http://localhost:3002/` for the homepage or `http://localhost:3002/colorpainting/` for the drawing app.

The static pages (homepage, soundscape) can be opened directly in a browser or served through the same Express server.

## Environment variables

| Variable | Location | Description |
|---|---|---|
| `OPENROUTER_API_KEY` | `colorpainting/.env` | OpenRouter API key (required for AI image generation) |
| `PORT` | `colorpainting/.env` | Server port (default: `3002`) |

## Deploying on a droplet

```bash
git clone <repo-url> brainbreak
cd brainbreak/colorpainting
npm install
npm run build
NODE_ENV=production node serve.js
```

### Nginx reverse proxy

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3002;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Use a process manager like `pm2` to keep the server running:

```bash
pm2 start serve.js --name mindspace -- --env production
```
