<p align="center">
  <img src="https://img.shields.io/badge/Remotion-4.0-blueviolet?style=for-the-badge&logo=react&logoColor=white" alt="Remotion 4.0" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-blue?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Gemini_AI-1.5_Flash-orange?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/Node.js-20+-green?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/License-UNLICENSED-red?style=for-the-badge" alt="License" />
</p>

<h1 align="center">🎬 HELIOS — AI Video Production Engine</h1>

<p align="center">
  <strong>Download any video. Analyze it with AI. Replace the boring parts. Add viral captions. Render a masterpiece.</strong>
</p>

<p align="center">
  <em>Built on <a href="https://remotion.dev">Remotion</a> · Powered by <a href="https://ai.google.dev">Google Gemini</a> · Assets by <a href="https://pollinations.ai">Pollinations AI</a></em>
</p>

---

## 🧠 What Is This?

**HELIOS** is an AI-powered video production pipeline that turns raw footage into viral-ready content — automatically. It downloads videos, uses **Gemini AI** to analyze every frame, replaces boring segments with stunning AI-generated visuals, and overlays **Hormozi-style animated captions** — all rendered as a professional video.

### ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🎥 **Video Ingest** | Download any YouTube/Shorts video with one command |
| 🧠 **AI Analysis** | Gemini 1.5 Flash segments video into KEEP vs REPLACE |
| 🗣️ **Auto-Transcription** | Word-level timestamps for every spoken word |
| 🎨 **AI Asset Generation** | Pollinations.ai generates cinematic filler images |
| 🔄 **Hybrid Rendering** | Seamlessly swaps between original footage and AI visuals |
| 💬 **Hormozi Captions** | Word-by-word animated captions with stroke outlines |
| 📱 **Multi-Format** | 1920×1080 landscape, 1080×1920 vertical, or custom |
| 🎬 **Pre-Built Ads** | PinnacleAd (kinetic typography) and GodMode (vertical motion) |

---

## 📋 Table of Contents

- [🧠 What Is This?](#-what-is-this)
- [⚡ Quick Start](#-quick-start)
- [🔑 API Keys Required](#-api-keys-required)
- [🏗️ Architecture](#️-architecture)
- [🎬 Compositions](#-compositions)
- [🚀 The Pipeline](#-the-pipeline)
- [📁 Project Structure](#-project-structure)
- [🛠️ All Commands](#️-all-commands)
- [🎨 Customization](#-customization)
- [🐛 Troubleshooting](#-troubleshooting)
- [📄 License](#-license)

---

## ⚡ Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/pinnacleaivideo-maker.git
cd pinnacleaivideo-maker

# 2. Install dependencies
npm install

# 3. Set up your API key
echo "GOOGLE_API_KEY=your_gemini_api_key_here" > .env

# 4. Open the studio (preview all compositions)
npm run dev
```

> 💡 Studio opens at **http://localhost:3000** — select any composition from the sidebar to preview.

---

## 🔑 API Keys Required

| API | Purpose | How to Get | Cost |
|-----|---------|------------|------|
| **Google Gemini** | Video analysis + transcription | [Google AI Studio](https://aistudio.google.com/apikey) → Create API Key | 🆓 Free tier available |
| **Pollinations.ai** | AI image generation (filler visuals) | No key needed — open API | 🆓 Free |
| **yt-dlp** | Video downloading | `npm install` handles it | 🆓 Free |

### Environment Setup

Create a `.env` file in the project root:

```env
GOOGLE_API_KEY=AIzaSy...your_key_here
```

> ⚠️ **Never commit your `.env` file.** It's already in `.gitignore`.

---

## 🏗️ Architecture

```
                    ┌──────────────────────────┐
                    │   analyze_hybrid.js      │
                    │   (Gemini 1.5 Flash)     │
                    └──────────┬───────────────┘
                               │
                    ┌──────────▼───────────────┐
                    │   hybrid_plan.json       │
                    │  ┌─────────┬───────────┐ │
                    │  │ visuals │ transcript │ │
                    │  └────┬────┴─────┬─────┘ │
                    └───────┼──────────┼───────┘
                            │          │
              ┌─────────────▼──┐  ┌────▼──────────────┐
              │  HybridLayer   │  │   OverlayLayer    │
              │  (Backgrounds) │  │   (Captions)      │
              │                │  │                   │
              │  KEEP → Zoom   │  │  Hormozi Style:   │
              │  REPLACE → Ken │  │  Word-by-word     │
              │     Burns +    │  │  Yellow highlight  │
              │     AI Image   │  │  Black stroke     │
              └───────┬────────┘  └────┬──────────────┘
                      │                │
              ┌───────▼────────────────▼──────┐
              │       WorkBench.tsx           │
              │    (Final Rendered Video)     │
              └──────────────────────────────┘
```

### The Decoupled Data Model

The system produces **two independent data streams** from one AI analysis:

| Data Stream | File Key | Consumer | Purpose |
|-------------|----------|----------|---------|
| **Visuals** | `visuals[]` | `HybridLayer.tsx` | What to show (original video or AI image) |
| **Transcript** | `transcript[]` | `OverlayLayer.tsx` | What was said (word-level timestamps) |

This separation ensures captions match **spoken words**, not visual descriptions.

---

## 🎬 Compositions

Open the Remotion Studio and select from the sidebar:

### 🖥️ WorkBench — *The Hybrid Video Enhancer*
- **Resolution:** 1080×1920 (vertical)
- **Duration:** 10 seconds (300 frames @ 30fps)
- **Features:** KEEP/REPLACE switching, Hormozi captions, theme overlays
- **Controls:** Theme selector (Standard, Cyberpunk, Vintage, HighContrast, Minimal)

### ⚡ PinnacleAd — *Viral Kinetic Typography*
- **Resolution:** 1920×1080 (landscape)
- **Duration:** 15 seconds (450 frames @ 30fps)
- **Features:** Rapid-fire word cuts, mesh background, glassmorphism dashboards, flash transitions

### 📱 GodMode — *Vertical Motion Video*
- **Resolution:** 1080×1920 (vertical)
- **Duration:** 15 seconds (450 frames @ 30fps)
- **Features:** Glitch title, physics-based video container, highlight captions

---

## 🚀 The Pipeline

Run the full AI enhancement pipeline:

```bash
# Step 1: Download a video
node ingest-video.js "https://www.youtube.com/shorts/AEO_8Y7BSAE"

# Step 2: Run the AI brain (analyzes video + generates transcript)
node analyze_hybrid.js

# Step 3: Generate AI filler images
node generate_fillers.js

# Step 4: Preview in studio
npm run dev

# Step 5: Render final video
npx remotion render WorkBench out/hybrid-video.mp4
```

Or run everything at once:

```bash
node run-pipeline.js
```

---

## 📁 Project Structure

```
📦 pinnacleaivideo-maker/
├── 🧠 AI Pipeline
│   ├── analyze_hybrid.js      # Gemini AI — segments video + transcribes
│   ├── generate_fillers.js    # Pollinations — generates replacement images
│   ├── analyze-video.js       # Basic video analysis (content-map mode)
│   ├── generate-assets.js     # Basic asset generation (content-map mode)
│   ├── ingest-video.js        # YouTube video downloader (yt-dlp)
│   ├── run-pipeline.js        # Full pipeline orchestrator
│   └── upload-result.js       # Upload rendered video
│
├── 🎬 Compositions (src/)
│   ├── Root.tsx               # Remotion entry — registers all compositions
│   ├── WorkBench.tsx          # Hybrid video enhancer
│   │
│   ├── PinnacleAd/            # Viral kinetic ad
│   │   ├── index.tsx          # Main composition
│   │   ├── KineticWord.tsx    # Animated word component
│   │   ├── FlashTransition.tsx
│   │   ├── InversionEffect.tsx
│   │   ├── MeshBackground.tsx
│   │   ├── HighDetailDashboard.tsx
│   │   ├── ProceduralMobile.tsx
│   │   └── ProfessionalLogo.tsx
│   │
│   ├── GodMode/               # Vertical motion video
│   │   ├── index.tsx
│   │   ├── GlitchTitle.tsx
│   │   ├── VideoContainer.tsx
│   │   └── HighlightCaption.tsx
│   │
│   └── Enhancers/             # Reusable video enhancement layers
│       ├── HybridLayer.tsx    # KEEP/REPLACE visual switcher
│       ├── OverlayLayer.tsx   # Hormozi word-by-word captions
│       ├── DynamicBackground.tsx
│       └── ColorGrade.tsx     # CSS filter-based color grading
│
├── 📂 public/
│   ├── hybrid_plan.json       # AI-generated plan (visuals + transcript)
│   ├── content-map.json       # Basic analysis output
│   ├── video-source.mp4       # Your input video
│   └── assets/                # AI-generated filler images
│
├── 📂 out/                    # Rendered output videos
├── .env                       # API keys (not committed)
├── package.json
├── remotion.config.ts
└── tsconfig.json
```

---

## 🛠️ All Commands

> 📌 See **[COMMANDS.md](./COMMANDS.md)** for the complete reference with examples.

| Command | What It Does |
|---------|-------------|
| `npm run dev` | 🎬 Open Remotion Studio (preview + edit) |
| `npm run grab` | 📥 Download video via yt-dlp |
| `node analyze_hybrid.js` | 🧠 AI video analysis + word transcription |
| `node generate_fillers.js` | 🎨 Generate AI replacement images |
| `node run-pipeline.js` | 🚀 Run full pipeline (analyze → generate → render) |
| `npx remotion render WorkBench out/video.mp4` | 📹 Render WorkBench to MP4 |
| `npx remotion render PinnacleAd out/ad.mp4` | ⚡ Render kinetic ad |
| `npx remotion render GodMode out/godmode.mp4` | 📱 Render vertical video |
| `npx remotion upgrade` | ⬆️ Upgrade Remotion to latest |

---

## 🎨 Customization

### Themes (WorkBench)

Change the theme in Remotion Studio's sidebar controls:

| Theme | Effect |
|-------|--------|
| Standard | Clean, no filter |
| Cyberpunk | Teal overlay + high saturation |
| Vintage | Sepia + warm tones |
| HighContrast | Dark overlay + punchy contrast |
| Minimal | Grayscale |

### Caption Style

Edit `src/Enhancers/OverlayLayer.tsx`:

```tsx
// Change colors
color: isActive ? "#FFE600" : "#FFFFFF"  // Yellow active, white inactive

// Change font size
fontSize: 88,

// Change stroke width
WebkitTextStroke: "5px black",
```

### Adding New Compositions

1. Create a new folder in `src/`
2. Export your component
3. Register it in `src/Root.tsx`:

```tsx
<Composition
  id="MyVideo"
  component={MyVideo}
  durationInFrames={300}
  fps={30}
  width={1920}
  height={1080}
/>
```

---

## 🐛 Troubleshooting

<details>
<summary><strong>❌ "GOOGLE_API_KEY not found"</strong></summary>

Create a `.env` file in the project root:
```
GOOGLE_API_KEY=your_key_here
```
Get a free key at [Google AI Studio](https://aistudio.google.com/apikey).
</details>

<details>
<summary><strong>❌ "Video file not found"</strong></summary>

Make sure `public/video-source.mp4` exists:
```bash
node ingest-video.js "YOUR_VIDEO_URL"
```
</details>

<details>
<summary><strong>❌ "Failed to load hybrid_plan.json"</strong></summary>

Run the analysis first:
```bash
node analyze_hybrid.js
```
</details>

<details>
<summary><strong>❌ Filler images not loading</strong></summary>

Generate them:
```bash
node generate_fillers.js
```
Check `public/assets/` for the downloaded images.
</details>

<details>
<summary><strong>❌ Remotion render fails</strong></summary>

```bash
# Clear cache and rebuild
rm -rf node_modules/.cache
npm run dev  # Verify in studio first, then render
```
</details>

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is **UNLICENSED** — private use only.

Remotion requires a [company license](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md) for some commercial use cases.

---

<p align="center">
  <strong>Built with 🧠 by <a href="https://pinnacleaisolutions.site">Pinnacle AI Solutions</a></strong><br/>
  <em>Making videos that stop the scroll.</em>
</p>
