# 🖼️ Image Background Remover

> Free online image background removal tool. 100% automatic, no signup required. Built with Cloudflare Workers + Remove.bg API.

**[Live Demo](https://your-domain.com)** | **[API Docs](#api-endpoint)**

## ✨ Features

- 🚀 **Lightning Fast** - Process images in 3-5 seconds
- 🔒 **100% Private** - Images never stored, processed in memory only
- 💯 **Completely Free** - No signup, no credit card required
- 📱 **Mobile Friendly** - Works on all devices
- 🎨 **High Quality** - Powered by Remove.bg's professional AI

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML + Tailwind CSS + Vanilla JS |
| Backend | Cloudflare Workers + Hono.js |
| Image API | [Remove.bg](https://www.remove.bg/api) |
| Hosting | Cloudflare Pages + Workers |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- [Remove.bg API Key](https://www.remove.bg/api) (free tier: 50 requests/month)

### Local Development

**1. Clone the repository**
```bash
git clone https://github.com/Cary-Bob/image-background-remover.git
cd image-background-remover
```

**2. Setup the Worker**

```bash
cd worker
npm install

# Set your Remove.bg API key as a secret
npx wrangler secret put REMOVE_BG_API_KEY
# Enter your API key when prompted

# Start local development server
npm run dev
```

**3. Setup Frontend (Local Preview)**

For local frontend testing with the worker, you can either:
- Use [Wrangler Pages](https://developers.cloudflare.com/pages/platform/functions-advanced-environments/#developing-locally-with-pages) to run both locally
- Or deploy the frontend to Cloudflare Pages and configure the Worker binding

**Frontend (Static):**
Simply open `frontend/index.html` in a browser, or serve it:
```bash
npx serve frontend
```

### Deploy to Cloudflare

**1. Deploy the Worker**
```bash
cd worker
npm run deploy
```

**2. Deploy the Frontend to Cloudflare Pages**

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → Pages
2. Create a project → Connect to GitHub
3. Select this repository
4. Set build command: (leave empty for static HTML)
5. Set output directory: `frontend`
6. Add custom domain if needed

**3. Configure Worker Route**

In `worker/wrangler.toml`, update the route pattern to match your domain:
```toml
routes = [{ pattern = "yourdomain.com/api/*", zone_name = "yourdomain.com" }]
```

Then redeploy:
```bash
cd worker && npm run deploy
```

## 📡 API Endpoint

### POST `/api/remove-bg`

Remove background from an image.

**Request:**
```
Content-Type: multipart/form-data
Body: { image: File }
```

**Response (Success):**
```
Content-Type: image/png
Body: PNG image with transparent background
```

**Response (Error):**
```json
{ "error": "Error description" }
```

**Error Codes:**
| Status | Error |
|--------|-------|
| 400 | File too large / Unsupported format |
| 500 | Invalid API key / Service error |
| 503 | API credits exhausted |

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `REMOVE_BG_API_KEY` | Your Remove.bg API key | Yes |

## 💰 Pricing

- **Remove.bg API**: Free tier includes 50 requests/month
- **Paid plans**: Start at $0.20 per image
- **Cloudflare Workers**: Free tier includes 100,000 requests/day
- **Cloudflare Pages**: Free with unlimited bandwidth

## 📄 License

MIT License - feel free to use for personal or commercial projects.

## 🙏 Acknowledgments

- [Remove.bg](https://www.remove.bg) - Professional background removal API
- [Cloudflare](https://cloudflare.com) - Edge computing platform
- [Hono.js](https://hono.dev) - Lightweight web framework
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
