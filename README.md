# Trimly 🎬

A modern, production-quality, **browser-only video trimming web application** built with **Svelte 5**, **Vite**, **TypeScript**, **Tailwind CSS**, and **FFmpeg WebAssembly** running inside a dedicated **Web Worker**.

> 🔒 **Privacy First:** Your video files never leave your device. All processing happens 100% locally inside your browser using WebAssembly. No server uploads, no cloud APIs, and no analytics telemetry.

---

## ✨ Features

- ⚡ **Local FFmpeg WASM Processing:** High-speed video stream trimming (`-c copy`) entirely in the browser.
- 🧵 **Web Worker Architecture:** FFmpeg execution runs off the main thread, keeping the UI smooth and responsive.
- 🌗 **Persistent Dark/Light Mode:** Toggle themes with automatic system preference detection and localStorage persistence.
- 🎛️ **Interactive Visual Timeline:** Dual handles for Start and End timestamps, selection range highlight, playhead indicator, track-click seeking, and touch/keyboard accessibility.
- ⏱️ **Fine Timestamp Controls:** Precise time inputs and `+1s`, `-1s`, `+0.1s`, `-0.1s` micro-step adjustment buttons.
- 🔁 **Range Loop Preview:** Audition the exact selected clip before initiating trim processing.
- 📊 **Progress & Cancelation:** Real-time percentage feedback and estimated processing stage updates with cancellation support.
- 🎨 **Sleek Modern UI:** Responsive dark/light modes, glassmorphism visual styling, and clear privacy status indicators.
- 📥 **Clean Filename Generation:** Download trimmed files with descriptive automatic naming (`original-trimmed.mp4`).

---

## 🛠️ Tech Stack

- **Framework:** Svelte 5 (utilizing Svelte 5 runes `$state`, `$derived`, `$props`, `$effect`)
- **Build Tool:** Vite
- **Language:** TypeScript
- **Package Manager / Runtime:** Bun
- **Styling:** Tailwind CSS v4
- **Video Engine:** `@ffmpeg/ffmpeg` and `@ffmpeg/util` (WebAssembly)
- **Icons:** Lucide Svelte
- **Containerization:** Docker & Nginx

---

## 🔒 Privacy & Architecture

```
User Browser
 ┌────────────────────────────────────────────────────────┐
 │ Main UI Thread (Svelte 5)                             │
 │  └─ Video Preview (HTML5 <video>)                      │
 │  └─ Interactive Timeline                               │
 └──────────────────────────┬─────────────────────────────┘
                            │ Post Messages (File Blob, timestamps)
                            ▼
 ┌────────────────────────────────────────────────────────┐
 │ Web Worker Thread                                      │
 │  └─ FFmpeg WebAssembly Core (@ffmpeg/core)             │
 │  └─ Virtual In-Memory File System (Write -> Exec -> Read) │
 └──────────────────────────┬─────────────────────────────┘
                            │ Returns Trimmed Blob
                            ▼
 ┌────────────────────────────────────────────────────────┐
 │ Main UI Thread                                         │
 │  └─ Download Result (Revokes Blobs on Cleanup)         │
 └──────────────────────────┘
```

---

## 🚀 Local Development

### Prerequisites
- [Bun](https://bun.sh/) (v1.1+) or Node.js (v20+)

### Setup & Execution

```bash
# Clone the repository
git clone https://github.com/user/trimly.git
cd trimly

# Install dependencies using Bun
bun install

# Start development server
bun run dev

# Run unit test suite
bun run test

# Build production bundle
bun run build

# Preview production build locally
bun run preview
```

---

## 🐳 Running with Docker

### Using Docker CLI

```bash
# Build Docker image
docker build -t trimly .

# Run Docker container on port 8080
docker run -p 8080:80 trimly
```

### Using Docker Compose

Create or use the existing `docker-compose.yml`:

```yaml
services:
  web:
    image: registry.devteddy.my.id/trimly:latest
    container_name: trimly
    ports:
      - "3000:80"
    restart: unless-stopped
```

Run with Docker Compose:

```bash
docker compose up -d
```

Then open `http://localhost:3000` in your browser.

---

## 📋 Supported File Formats

Trimly supports common video formats handled by standard browsers and FFmpeg:
- **MP4** (`.mp4`)
- **WebM** (`.webm`)
- **MOV** (`.mov`)
- **MKV** (`.mkv`)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
