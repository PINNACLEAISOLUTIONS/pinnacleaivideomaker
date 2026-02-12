const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Configuration
const VIDEO_PATH = path.join(__dirname, "public", "video-source.mp4");
const OUTPUT_JSON = path.join(__dirname, "public", "content-map.json");

console.log("🧠 Brain Initializing (Real AI Mode)...");

if (!process.env.GOOGLE_API_KEY) {
    console.error("❌ Error: GOOGLE_API_KEY not found in .env file");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const fileManager = new GoogleAIFileManager(process.env.GOOGLE_API_KEY);

async function analyzeVideo() {
    try {
        console.log("👀 Uploading video to Gemini File API...");

        if (!fs.existsSync(VIDEO_PATH)) {
            throw new Error(`Video file not found at ${VIDEO_PATH}`);
        }

        const uploadResponse = await fileManager.uploadFile(VIDEO_PATH, {
            mimeType: "video/mp4",
            displayName: "Source Video for Analysis",
        });

        console.log(`✅ Uploaded video: ${uploadResponse.file.uri}`);
        let file = await fileManager.getFile(uploadResponse.file.name);

        // Wait for processing
        console.log("⏳ Waiting for video processing...");
        while (file.state === "PROCESSING") {
            process.stdout.write(".");
            await new Promise((resolve) => setTimeout(resolve, 2000));
            file = await fileManager.getFile(uploadResponse.file.name);
        }
        console.log(`\n✅ Video Analysis Ready. State: ${file.state}`);

        if (file.state === "FAILED") {
            throw new Error("Video processing failed.");
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
        Analyze this video. Break it down into distinctive visual segments (minimum 5 seconds each).
        For each segment, provide:
        1. "start" (start time in seconds as number)
        2. "duration" (duration in seconds as number)
        3. "keyword" (a short, punchy 2-3 word visual concept, e.g. "Cyberpunk City", "Peaceful Nature")
        4. "prompt" (a highly detailed, photorealistic image generation prompt describing a BACKGROUND WALLPAPER that matches the mood/content. No text, just visuals. e.g. "cinematic wide shot of a futuristic city with neon rain, 8k, blurred background")
        
        Return ONLY valid JSON array format like:
        [
            { "start": 0, "duration": 5, "keyword": "...", "prompt": "..." }
        ]
        `;

        console.log("🧠 Thinking...");
        const result = await model.generateContent([
            { fileData: { mimeType: file.mimeType, fileUri: file.uri } },
            { text: prompt },
        ]);

        const responseText = result.response.text();
        const jsonMatch = responseText.match(/\[[\s\S]*\]/);

        if (!jsonMatch) {
            throw new Error("Failed to parse JSON from AI response: " + responseText);
        }

        const visualPlan = JSON.parse(jsonMatch[0]);

        fs.writeFileSync(OUTPUT_JSON, JSON.stringify(visualPlan, null, 2));
        console.log(`✅ Brain Analysis Complete! Visual Plan saved to ${OUTPUT_JSON}`);
        console.log("📋 Plan Preview:", visualPlan.map(s => `[${s.start}s]: ${s.keyword}`).join(", "));

    } catch (error) {
        console.error("❌ Brain Freeze:", error);
        process.exit(1);
    }
}

analyzeVideo();
