# Coloring Book Generator

Draw a rough sketch and this app will turn it into a beautiful, detailed coloring book page that you can fill in with colors right in the browser.

Powered by Google Gemini via [OpenRouter](https://openrouter.ai/).

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- An [OpenRouter](https://openrouter.ai/) API key

## Installation

```bash
git clone <repo-url>
cd idea_1
npm install
```

## Configuration

Copy the example env file and add your OpenRouter API key:

```bash
cp .env.example .env
```

Then edit `.env` and replace the placeholder with your actual key:

```
OPENROUTER_API_KEY=sk-or-v1-your-key-here
```

## Running

```bash
npm run dev
```

This starts both the Express backend (port 3001) and the Vite dev server (port 5173).

Open [http://localhost:5173](http://localhost:5173) in your browser.

## How to use

1. Draw something on the canvas (a person, animal, house, anything!)
2. Optionally add a text hint to help describe your drawing
3. Click **Generate Coloring Page**
4. Once the coloring book page appears, pick a color and click on any white area to fill it in
