const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Configuration
const VIDEO_PATH = path.join(__dirname, "public", "video-source.mp4");
const OUTPUT_JSON = path.join(__dirname, "public", "hybrid_plan.json");

console.log("🧠 Hybrid Brain v2 — Dual Output Mode");

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

        // Upload
        const uploadResponse = await fileManager.uploadFile(VIDEO_PATH, {
            mimeType: "video/mp4",
            displayName: "Source Video for Hybrid Analysis",
        });

        console.log(`✅ Uploaded: ${uploadResponse.file.uri}`);
        let file = await fileManager.getFile(uploadResponse.file.name);

        // Wait for processing
        console.log("⏳ Waiting for video processing...");
        while (file.state === "PROCESSING") {
            process.stdout.write(".");
            await new Promise((resolve) => setTimeout(resolve, 2000));
            file = await fileManager.getFile(uploadResponse.file.name);
        }
        console.log(`\n✅ Ready. State: ${file.state}`);

        if (file.state === "FAILED") {
            throw new Error("Video processing failed.");
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
        Analyze this video carefully and return a JSON object with TWO keys:

        KEY 1: "visuals" — An array of visual segments:
        Each segment has: start (seconds), end (seconds), type, and optionally visual_prompt.
        
        Rules for "type":
        - "KEEP" if the screen shows a specific website UI, URL bar, software dashboard, or specific results.
        - "REPLACE" if the screen shows a generic keyboard, person talking, random wall, stock footage, or typing hands.
        
        For REPLACE segments, provide a "visual_prompt" — a punchy description for an AI image generator.
        Style: "Cyberpunk, neon, cinematic lighting, 4k". Match the context of what was being shown.

        KEY 2: "transcript" — An array of spoken words with timestamps:
        Each object has: word (string), start (seconds), end (seconds).
        Transcribe every spoken word with accurate timing aligned to the audio.

        Return ONLY raw JSON. Example:
        {
            "visuals": [
                { "start": 0, "end": 3.5, "type": "KEEP", "description": "Software UI" },
                { "start": 3.5, "end": 8, "type": "REPLACE", "visual_prompt": "Cyberpunk hacker, neon blue" }
            ],
            "transcript": [
                { "word": "Here", "start": 0.1, "end": 0.4 },
                { "word": "are", "start": 0.4, "end": 0.6 },
                { "word": "the", "start": 0.6, "end": 0.8 },
                { "word": "results", "start": 0.8, "end": 1.3 }
            ]
        }
        `;

        console.log("🧠 Thinking (Hybrid Segmentation + Transcription)...");
        const result = await model.generateContent([
            { fileData: { mimeType: file.mimeType, fileUri: file.uri } },
            { text: prompt },
        ]);

        const responseText = result.response.text();
        const cleanText = responseText
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        let hybridPlan;
        try {
            hybridPlan = JSON.parse(cleanText);
        } catch (e) {
            console.error("Failed to parse JSON:", cleanText);
            throw e;
        }

        // Validate structure
        if (!hybridPlan.visuals || !hybridPlan.transcript) {
            console.warn("⚠️ Missing keys — attempting auto-fix...");
            if (Array.isArray(hybridPlan)) {
                // Old format fallback: wrap in visuals, empty transcript
                hybridPlan = { visuals: hybridPlan, transcript: [] };
            }
        }

        fs.writeFileSync(OUTPUT_JSON, JSON.stringify(hybridPlan, null, 2));
        console.log(`✅ Hybrid Plan saved to ${OUTPUT_JSON}`);
        console.log(`📋 Visuals: ${hybridPlan.visuals.length} segments`);
        console.log(`📋 Transcript: ${hybridPlan.transcript.length} words`);

        hybridPlan.visuals.forEach((s) =>
            console.log(
                `  [${s.start.toFixed(1)}s - ${s.end.toFixed(1)}s] ${s.type} ${s.visual_prompt ? "-> " + s.visual_prompt.substring(0, 30) + "..." : ""}`
            )
        );
    } catch (error) {
        console.error("❌ Brain Freeze:", error);
        process.exit(1);
    }
}

analyzeVideo();
