const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");
const fs = require("fs");
const path = require("path");

const API_KEY = "AIzaSyBMviyytisOyjSxXvFtEUq8JNM9Xh7USQ0";
const fileManager = new GoogleAIFileManager(API_KEY);
const genAI = new GoogleGenerativeAI(API_KEY);

const VIDEO_PATH = path.join(__dirname, "public", "video-source.mp4");
const OUTPUT_JSON = path.join(__dirname, "public", "hybrid_plan.json");

async function run() {
    try {
        console.log("🚀 Testing with gemini-1.5-flash-latest...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        const result = await model.generateContent("hello");
        console.log("Success:", result.response.text());

        console.log("📤 Attempting Video Analysis...");
        const uploadResult = await fileManager.uploadFile(VIDEO_PATH, {
            mimeType: "video/mp4",
            displayName: "Test Video",
        });
        console.log("Uploaded:", uploadResult.file.uri);
    } catch (e) {
        console.error("Failed:", e.message);
        console.log("Status:", e.status);
    }
}

run();
