const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");
const fs = require("fs");
const path = require("path");

const API_KEY = "AIzaSyBMviyytisOyjSxXvFtEUq8JNM9Xh7USQ0";
const fileManager = new GoogleAIFileManager(API_KEY);
const genAI = new GoogleGenerativeAI(API_KEY);

const VIDEO_PATH = path.join(__dirname, "public", "video-source.mp4");
const OUTPUT_BLUEPRINT = path.join(__dirname, "public", "blueprint.json");

async function architectVideoPlan() {
    console.log("🎬 [AKOR] Activating Level 9 Video Architect (Gemini 2.5 Flash Mode)...");

    if (!fs.existsSync(VIDEO_PATH)) {
        console.error("❌ Video source missing at public/video-source.mp4");
        return;
    }

    console.log("📤 Uploading Source Video for Architect Review...");
    const uploadResult = await fileManager.uploadFile(VIDEO_PATH, {
        mimeType: "video/mp4",
        displayName: "Architect Source",
    });

    let file = await fileManager.getFile(uploadResult.file.name);
    while (file.state === "PROCESSING") {
        process.stdout.write(".");
        await new Promise((resolve) => setTimeout(resolve, 5000));
        file = await fileManager.getFile(uploadResult.file.name);
    }
    console.log("\n✅ Video Ingested.");

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
    # Role: Aker Video Architect (Level 9)
    You are the elite automated video director for "Pinnacle AI Solutions."
    Your goal: Transform this raw video into a high-retention YouTube Short (vertical 9:16, <60s) that feels like a high-budget commercial.

    # 1. The "Retention First" Protocol
    Analyze the input for:
    * Hook (0-3s): Visual/audio trigger to stop the scroll.
    * Pacing: Fast cuts (1-2s) for energy, slower (3-5s) for emphasis.
    * Vibe: Match music and color palette to high-end brand emotion.

    # 2. The Hybrid Sourcing Logic (CRITICAL)
    * Real World (City, Office, Nature, Crowds, Generic Tech) -> "STOCK"
    * Specific/Sci-Fi (Glowing HUD, Robot, Brand Logo, Impossible Scenes) -> "GENERATE"

    # 3. Director Mode: AI Prompt Syntax
    Generate prompt: [SUBJECT] + [ACTION] + [ENVIRONMENT] + [LIGHTING/MOOD] + [LENS/CAMERA]

    # Output Requirements:
    Return ONLY a single valid JSON object. No conversational filler.
    Use this EXACT Schema:
    {
      "project": {
        "title": "String",
        "duration_seconds": 60,
        "music_mood": "Phonk | Lo-fi | Corporate | Cinematic | High-Energy",
        "brand_color": "#FFE600"
      },
      "timeline": [
        {
          "id": 1,
          "duration": 3,
          "type": "STOCK",
          "search_term": "Cinematic drone shot city skyline night vertical",
          "caption": "String",
          "transition": "glitch"
        },
        {
          "id": 2,
          "duration": 4,
          "type": "GENERATE",
          "visual_prompt": "Prompt following syntax...",
          "caption": "String",
          "transition": "fade"
        }
      ]
    }

    Analyze the spoken content and visuals of the provided video file and generate the blueprint.
    `;

    try {
        console.log("🧠 Thinking (Retention First Strategy)...");
        const result = await model.generateContent([
            {
                fileData: {
                    mimeType: uploadResult.file.mimeType,
                    fileUri: uploadResult.file.uri,
                },
            },
            { text: prompt },
        ]);

        const text = result.response.text().trim();
        const blueprint = JSON.parse(text.replace(/```json|```/g, ""));

        fs.writeFileSync(OUTPUT_BLUEPRINT, JSON.stringify(blueprint, null, 2));
        console.log("💾 Enterprise Blueprint Saved: public/blueprint.json");
    } catch (e) {
        console.error("❌ Architect Logic Error:", e.message);
        if (e.response) console.log(JSON.stringify(e.response, null, 2));
    }
}

architectVideoPlan();
