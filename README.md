# Image Background Remover

AI-powered image background removal tool. Upload a photo, get a transparent PNG instantly.

**Live demo:** https://your-domain.com

## Features

- 🖼️ Upload JPG / PNG / WEBP (up to 12MB)
- 🤖 AI background removal via [Remove.bg API](https://remove.bg)
- 🔄 Before/after slider comparison
- ⬇️ Download transparent PNG
- 🌍 English & Chinese UI
- 🔒 Images are never stored — processed in-memory and discarded
- ⚡ Deployed on Cloudflare Pages + Workers (global CDN)

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite + TailwindCSS |
| Backend | Cloudflare Workers (proxy) |
| AI API | Remove.bg |
| CDN | Cloudflare Pages |

## Local Development

### 1. Clone

```bash
git clone https://github.com/hujunai822/Image-Background-Remover.git
cd Image-Background-Remover
```

### 2. Start Worker (backend proxy)

```bash
cd worker
npm install -g wrangler
wrangler dev
# Worker runs on http://localhost:8787
```

Set your Remove.bg API key:
```bash
wrangler secret put REMOVE_BG_API_KEY
# Paste your key when prompted
```

### 3. Start Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
# Open http://localhost:5173
```

## Deployment

### Deploy Worker to Cloudflare

```bash
cd worker
wrangler deploy
wrangler secret put REMOVE_BG_API_KEY
```

### Deploy Frontend to Cloudflare Pages

Connect the `frontend/` directory to Cloudflare Pages:
- Build command: `npm run build`
- Build output: `dist`
- Set env var: `VITE_WORKER_URL=https://your-worker.workers.dev/api`

## Project Structure

```
Image-Background-Remover/
├── frontend/               # React app (Cloudflare Pages)
│   ├── src/
│   │   ├── App.jsx         # Main app + translations
│   │   └── components/
│   │       ├── Header.jsx
│   │       ├── Footer.jsx
│   │       ├── Uploader.jsx        # Drag & drop upload
│   │       └── CompareSlider.jsx   # Before/after slider
│   └── public/
│       ├── robots.txt
│       └── sitemap.xml
└── worker/                 # Cloudflare Worker (API proxy)
    └── src/index.js        # Proxies requests to Remove.bg
```

## API

`POST /api/remove-bg`
- Body: `multipart/form-data` with `image_file` field
- Response: PNG blob (transparent background)

## Privacy

Images are processed in-memory and never written to disk or stored in any database.

## License

MIT
