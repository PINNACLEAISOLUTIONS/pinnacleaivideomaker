const { GoogleAIFileManager } = require("@google/generative-ai/server");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require("path");
require("dotenv").config();

const API_KEY = process.env.GOOGLE_API_KEY;
const fileManager = new GoogleAIFileManager(API_KEY);

async function uploadToGemini() {
    const videoPath = path.join(__dirname, "out", "enhanced-video.mp4");

    console.log("⬆️ Uploading to Gemini File API...");
    console.log(`📁 Source: ${videoPath}`);

    try {
        const uploadResponse = await fileManager.uploadFile(videoPath, {
            mimeType: "video/mp4",
            displayName: "Enhanced Video Output",
        });

        console.log(`✅ Upload Complete!`);
        console.log(`🔗 Name: ${uploadResponse.file.name}`);
        console.log(`🔗 URI: ${uploadResponse.file.uri}`);
        console.log(`🕒 State: ${uploadResponse.file.state}`);

        console.log("\n The video is now accessible to Gemini models for analysis via this URI.");

    } catch (error) {
        console.error("❌ Upload Failed:", error.message);
        if (error.message.includes("Module not found")) {
            console.log("💡 You might need to install: npm install @google/generative-ai");
        }
    }
}

uploadToGemini();
