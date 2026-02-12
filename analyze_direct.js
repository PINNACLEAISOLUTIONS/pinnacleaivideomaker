const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");
const fs = require("fs");
const path = require("path");

// DIRECT KEY INJECTION PER PROTOCOL
const API_KEY = "AIzaSyDTTue44_dDXdP_s_-7ETtalTOuTgjBdgs";
const fileManager = new GoogleAIFileManager(API_KEY);
const genAI = new GoogleGenerativeAI(API_KEY);

const VIDEO_PATH = path.join(__dirname, "public", "video-source.mp4");
const OUTPUT_JSON = path.join(__dirname, "public", "hybrid_plan.json");

async function analyzeEntireVideo() {
    console.log("🚀 [HELIOS] ARCHITECT-LEVEL Deep Analysis (Direct Key Mode)...");

    if (!fs.existsSync(VIDEO_PATH)) {
        console.error("❌ Video source missing at public/video-source.mp4");
        return;
    }

    console.log("📤 Uploading ENTIRE video to Gemini...");
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
    Analyze this ENTIRE video.
    You are a Senior Creative Director specialized in high-end viral content.

    Return a JSON object with exactly TWO keys:

    KEY 1: "segments"
    An array of visual objects: { start, end, type, visual_prompt }
    - "type": "KEEP" (original video) or "REPLACE" (high-end visual).
    - "visual_prompt": For REPLACE segments, provide a prompt for a high-fidelity image. 
      Prompts must append: "hyper-realistic, 8k resolution, cinematic lighting, vertical 9:16 aspect ratio."
    - Segments should be between 2 to 6 seconds long.

    KEY 2: "transcript"
    An array of every word spoken: { word, start, end }
    - Word-level timestamps only.

    Return ONLY raw JSON. No markdown blocks.
    `;

    console.log("🧠 Thinking... (Segments + Transcription)");
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
        console.log("💾 Enterprise hybrid_plan.json saved.");
    } catch (e) {
        console.error("❌ JSON Parse Failed. Response from AI:");
        console.log(responseText);
    }
}

analyzeEntireVideo();
