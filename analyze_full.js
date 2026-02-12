const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const API_KEY = process.env.GOOGLE_API_KEY;
const fileManager = new GoogleAIFileManager(API_KEY);
const genAI = new GoogleGenerativeAI(API_KEY);

const VIDEO_PATH = path.join(__dirname, "public", "video-source.mp4");
const OUTPUT_JSON = path.join(__dirname, "public", "hybrid_plan.json");

async function analyzeEntireVideo() {
    console.log("🚀 [HELIOS] Starting ARCHITECT-LEVEL Deep Analysis...");

    if (!fs.existsSync(VIDEO_PATH)) {
        console.error("❌ Video source missing at public/video-source.mp4");
        return;
    }

    console.log("📤 Uploading entire video to Gemini...");
    const uploadResult = await fileManager.uploadFile(VIDEO_PATH, {
        mimeType: "video/mp4",
        displayName: "Full Production Source",
    });

    let file = await fileManager.getFile(uploadResult.file.name);
    while (file.state === "PROCESSING") {
        process.stdout.write(".");
        await new Promise((resolve) => setTimeout(resolve, 5000));
        file = await fileManager.getFile(uploadResult.file.name);
    }
    console.log("\n✅ Video processed by Gemini.");

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    Analyze this ENTIRE video. Do not stop at 10 seconds.
    You are a Senior Creative Director specialized in high-end viral content.

    Return a JSON object with exactly TWO keys:

    KEY 1: "segments"
    An array of visual objects: { start, end, type, visual_prompt }
    - "type": "KEEP" (original video) or "REPLACE" (high-end visual).
    - "visual_prompt": For REPLACE segments, provide a prompt for a high-fidelity image. 
      Prompts must append: "hyper-realistic, 8k resolution, cinematic lighting, raytracing, unreal engine 5, vertical 9:16 aspect ratio."
      Prompts should be serious and cinematic (e.g., "A moody, high-tech server room with pulsing neon blue lights" vs "a computer").
    - Segments should be between 2 to 5 seconds long.

    KEY 2: "transcript"
    An array of every word spoken: { word, start, end }
    - Timing must be exact word-level for Hormozi-style captions.

    Return ONLY raw JSON. No markdown blocks.
    `;

    console.log("🧠 Thinking... (Analyzing full duration and transcribing words)");
    const result = await model.generateContent([
        {
            fileData: {
                mimeType: uploadResult.file.mimeType,
                fileUri: uploadResult.file.uri,
            },
        },
        { text: prompt },
    ]);

    const responseText = result.response.text().trim();
    try {
        const hybridPlan = JSON.parse(responseText.replace(/```json|```/g, ""));
        fs.writeFileSync(OUTPUT_JSON, JSON.stringify(hybridPlan, null, 2));
        console.log("💾 Enterprise hybrid_plan.json saved successfully.");
    } catch (e) {
        console.error("❌ Failed to parse Gemini response as JSON. Raw output:");
        console.log(responseText);
    }
}

analyzeEntireVideo();
