# Image Background Remover

An AI-powered web application that removes image backgrounds automatically using deep learning.

## Features

- 🖼️ Upload images (JPG, PNG, WebP)
- 🤖 AI-powered background removal (rembg / U2Net)
- ⬇️ Download result as PNG with transparent background
- 🚀 Fast processing via REST API
- 💻 Clean, responsive frontend

## Tech Stack

- **Frontend:** React + Vite + TailwindCSS
- **Backend:** FastAPI + rembg
- **Model:** U2Net (via rembg)

## Quick Start

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## API

`POST /api/remove-bg` — Upload an image, get back a PNG with transparent background.

## Project Structure

```
Image-Background-Remover/
├── frontend/          # React app
├── backend/           # FastAPI server
└── docs/              # Documentation
```

## License

MIT
