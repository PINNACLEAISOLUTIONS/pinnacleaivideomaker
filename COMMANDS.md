# 📖 HELIOS — Command Reference

> Complete command reference for the HELIOS AI Video Production Engine.
> All commands should be run from the project root directory.

---

## 📦 Setup

```bash
# Install all dependencies
npm install

# Set up environment (create .env with your API key)
echo "GOOGLE_API_KEY=your_gemini_key" > .env
```

---

## 🎬 Studio (Preview & Edit)

```bash
# Open Remotion Studio (default port 3000)
npm run dev

# Open on a specific port
npx remotion studio --port 3123

# Open and auto-launch browser
npx remotion studio --port 3123 --open
```

> In the studio, select compositions from the left sidebar:
> `WorkBench` · `PinnacleAd` · `GodMode` · `HelloWorld`

---

## 📥 Video Ingest

```bash
# Download a YouTube video (saves to public/video-source.mp4)
npm run grab

# Download a specific URL
node ingest-video.js "https://www.youtube.com/shorts/VIDEO_ID"

# Download a full YouTube video
node ingest-video.js "https://www.youtube.com/watch?v=VIDEO_ID"
```

---

## 🧠 AI Analysis (The Brain)

```bash
# Analyze video with Gemini AI
# Produces: public/hybrid_plan.json (visuals + transcript)
node analyze_hybrid.js
```

**What it does:**
1. Uploads `public/video-source.mp4` to Gemini File API
2. Waits for processing
3. Asks Gemini to segment into KEEP/REPLACE + transcribe words
4. Saves `public/hybrid_plan.json`

**Output format:**
```json
{
  "visuals": [
    { "start": 0, "end": 3.5, "type": "KEEP", "description": "..." },
    { "start": 3.5, "end": 7, "type": "REPLACE", "visual_prompt": "..." }
  ],
  "transcript": [
    { "word": "Hello", "start": 0.1, "end": 0.4 },
    { "word": "world", "start": 0.5, "end": 0.9 }
  ]
}
```

---

## 🎨 Asset Generation

```bash
# Generate AI filler images for REPLACE segments
# Uses: Pollinations.ai (Flux model)
# Saves to: public/assets/filler-{index}.jpg
node generate_fillers.js
```

**Behavior:**
- Only processes `type: "REPLACE"` segments
- Skips segments that already have assets
- Updates `hybrid_plan.json` with asset paths automatically
- Images are 1080×1920 (vertical) by default

---

## 📥 Basic Analysis (Legacy Mode)

```bash
# Simple video analysis (produces content-map.json)
node analyze-video.js

# Generate assets from content-map
node generate-assets.js
```

---

## 🚀 Full Pipeline

```bash
# Run everything in sequence:
# 1. Analyze video (AI)
# 2. Generate filler assets
# 3. Render final video
node run-pipeline.js
```

**Output:** `out/hybrid-video.mp4`

---

## 📹 Rendering

```bash
# Render the hybrid WorkBench video
npx remotion render WorkBench out/hybrid-video.mp4

# Render the kinetic ad (1920x1080)
npx remotion render PinnacleAd out/pinnacle-ad.mp4

# Render vertical GodMode (1080x1920)
npx remotion render GodMode out/godmode.mp4

# Render HelloWorld demo
npx remotion render HelloWorld out/hello.mp4

# Render with custom settings
npx remotion render WorkBench out/custom.mp4 \
  --codec h264 \
  --quality 100 \
  --scale 2

# Render specific frame range
npx remotion render WorkBench out/clip.mp4 \
  --frames 0-90

# Render as GIF
npx remotion render WorkBench out/preview.gif \
  --codec gif \
  --every-nth-frame 2

# Render only a still frame (thumbnail)
npx remotion still WorkBench out/thumb.png --frame 45
```

---

## 🔧 Maintenance

```bash
# Upgrade Remotion to latest version
npx remotion upgrade
npm run upgrade

# Lint the source code
npm run lint

# Build (bundle for deployment)
npm run build

# Check what compositions are available
npx remotion compositions
```

---

## 🗂️ File Locations

| File | Location | Purpose |
|------|----------|---------|
| Input video | `public/video-source.mp4` | Your source footage |
| AI plan | `public/hybrid_plan.json` | Segments + transcript |
| Content map | `public/content-map.json` | Legacy analysis |
| AI assets | `public/assets/*.jpg` | Generated filler images |
| Rendered output | `out/*.mp4` | Final videos |
| API keys | `.env` | Google Gemini key |
| Config | `remotion.config.ts` | Remotion settings |

---

## 💡 Pro Tips

```bash
# Preview a specific composition directly
npx remotion studio --props '{"theme":"Cyberpunk"}' 

# Render at 4K (2x scale)
npx remotion render WorkBench out/4k.mp4 --scale 2

# Speed up renders with concurrency
npx remotion render WorkBench out/fast.mp4 --concurrency 4

# Export as WebM (smaller file size)
npx remotion render WorkBench out/web.webm --codec vp8
```
