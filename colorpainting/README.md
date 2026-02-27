# ColorPainting

Draw a rough sketch and this app will turn it into a beautiful, detailed coloring book page that you can fill in with colors right in the browser.

Powered by Google Gemini via [OpenRouter](https://openrouter.ai/).

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- An [OpenRouter](https://openrouter.ai/) API key

## Setup

```bash
cd colorpainting
npm install
```

Create a `.env` file with your API key:

```
OPENROUTER_API_KEY=sk-or-v1-your-key-here
```

## Running

### Development (with HMR)

```bash
npm run dev
```

Starts a unified Express + Vite server on `http://localhost:3002`. Vite handles the React app at `/colorpainting/` with hot module replacement. The project root (homepage, soundscape) is served at `/`.

- Homepage: `http://localhost:3002/`
- ColorPainting: `http://localhost:3002/colorpainting/`

### Production

```bash
npm run build
npm start
```

Builds the React app into `dist/`, then serves it with Express on `http://localhost:3002`. Same URLs as dev mode, but using static built files instead of Vite HMR.

### Build only

```bash
npm run build
```

## Deployment

On a server (e.g. DigitalOcean droplet):

```bash
npm run build
NODE_ENV=production npm start
```

Put behind Nginx as a reverse proxy to port 3002.

## Project structure

```
brainbreak/
├── index.html          # Homepage
├── homepage/           # Homepage assets
├── soundscape/         # Soundscape app
├── shared/             # Shared assets
└── colorpainting/      # This app
    ├── serve.js        # Unified dev/production server
    ├── src/
    │   ├── App.jsx     # Main app component
    │   └── components/ # Canvas, palette components
    ├── dist/           # Built output (after npm run build)
    └── .env            # API key (not committed)
```

## How to use

1. Draw something on the canvas (a person, animal, house, anything!)
2. Optionally add a text hint to help describe your drawing
3. Click **Create coloring page**
4. Once the coloring book page appears, pick a color and click on any white area to fill it in
