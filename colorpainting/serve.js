import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3002;

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ---- API route (same as server/index.js) ----
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

app.post('/api/generate', async (req, res) => {
  const { image, text } = req.body;

  if (!image) {
    return res.status(400).json({ error: 'Please draw something first' });
  }

  if (!OPENROUTER_API_KEY) {
    return res.status(500).json({ error: 'OPENROUTER_API_KEY is not configured' });
  }

  try {
    const hint = text?.trim() ? ` The drawing is of: ${text.trim()}.` : '';

    const imageResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Look at this rough sketch. It shows a simple/rough drawing of something. Identify what the subject is (a person, animal, object, scene, etc.) and then generate a beautiful, detailed coloring book page of that same subject.

For example:
- If the sketch is a stick figure → generate a full, detailed cartoon person as a coloring book page
- If the sketch is a rough fish shape → generate a beautiful detailed fish coloring book page
- If the sketch is a wobbly house → generate a lovely detailed house coloring book page

The output should be:
- A professional, detailed coloring book illustration of the same subject as the sketch
- Thick, clear black outlines
- Large, well-defined empty white regions easy to color in
- No shading, no gradients, no filled/colored areas — pure black outlines on white
- Fun, detailed, and appealing — something you'd find in a real coloring book
- White background${hint}`,
              },
              {
                type: 'image_url',
                image_url: { url: image },
              },
            ],
          },
        ],
        modalities: ['image', 'text'],
        image_config: {
          image_size: '1K',
        },
      }),
    });

    if (!imageResponse.ok) {
      const err = await imageResponse.text();
      console.error('Image generation error (status', imageResponse.status, '):', err);
      return res.status(502).json({ error: `Failed to generate image: ${err}` });
    }

    const imageData = await imageResponse.json();
    const message = imageData.choices?.[0]?.message;

    const imageEntry = message?.images?.[0];
    if (imageEntry?.image_url?.url) {
      return res.json({ image: imageEntry.image_url.url });
    }

    if (Array.isArray(message?.content)) {
      for (const part of message.content) {
        if (part.type === 'image_url' && part.image_url?.url) {
          return res.json({ image: part.image_url.url });
        }
      }
    }

    console.error('Unexpected response structure:', JSON.stringify(imageData, null, 2));
    return res.status(502).json({ error: 'No image returned from generation model' });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ---- Static files ----
// Serve the entire project root (homepage, soundscape, colorpainting/dist)
const projectRoot = path.join(__dirname, '..');
app.use(express.static(projectRoot));

// Fallback: serve colorpainting's built index for SPA routes
app.use('/colorpainting/dist', express.static(path.join(__dirname, 'dist')));

app.listen(PORT, () => {
  console.log(`Mindspace running on http://localhost:${PORT}`);
});
