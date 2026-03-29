import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { BodyData } from 'hono/request';

type Env = {
  REMOVE_BG_API_KEY: string;
};

const app = new Hono<{ Bindings: Env }>();

// CORS middleware
app.use('*', cors({
  origin: '*',
  allowMethods: ['POST', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
  maxAge: 86400,
}));

// Constants
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

app.post('/api/remove-bg', async (c) => {
  try {
    // Parse multipart form data
    const body = await c.req.parseBody({ all: true });
    const image = (body as BodyData)['image'];

    if (!image || !(image instanceof File)) {
      return c.json({ error: 'No image file provided' }, 400);
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(image.type)) {
      return c.json({ error: 'Unsupported format. Please use JPG, PNG, or WebP.' }, 400);
    }

    // Validate file size
    if (image.size > MAX_FILE_SIZE) {
      return c.json({ error: 'File too large. Maximum size is 10MB.' }, 400);
    }

    const apiKey = c.env.REMOVE_BG_API_KEY;
    if (!apiKey) {
      console.error('REMOVE_BG_API_KEY is not set');
      return c.json({ error: 'Service configuration error' }, 500);
    }

    // Convert File to ArrayBuffer for fetch
    const arrayBuffer = await image.arrayBuffer();

    // Call Remove.bg API
    const removeBgResponse = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
      },
      body: await new Response(arrayBuffer).blob(),
    });

    if (!removeBgResponse.ok) {
      // Handle Remove.bg specific errors
      const errorText = await removeBgResponse.text();
      console.error('Remove.bg API error:', removeBgResponse.status, errorText);

      if (removeBgResponse.status === 402) {
        return c.json({ error: 'API credits exhausted. Please try again later.' }, 503);
      }
      if (removeBgResponse.status === 400) {
        return c.json({ error: 'Invalid image or format not supported by API.' }, 400);
      }
      if (removeBgResponse.status === 403) {
        return c.json({ error: 'Invalid API key.' }, 500);
      }

      return c.json({ error: 'Background removal failed. Please try again.' }, 500);
    }

    // Return the processed image directly
    const resultBuffer = await removeBgResponse.arrayBuffer();
    const contentType = removeBgResponse.headers.get('content-type') || 'image/png';

    return new Response(resultBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (err) {
    console.error('Worker error:', err);
    return c.json({ error: 'Internal server error. Please try again.' }, 500);
  }
});

// Health check
app.get('/api/health', (c) => c.json({ status: 'ok' }));

export default app;
