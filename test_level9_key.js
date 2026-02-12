const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = "AIzaSyBMviyytisOyjSxXvFtEUq8JNM9Xh7USQ0";

async function verifyKey() {
    console.log("🏁 Testing Level 9 Access (Key: AIzaSyBM...)");
    const genAI = new GoogleGenerativeAI(API_KEY);

    const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];

    for (const modelName of models) {
        try {
            console.log(`🔍 Checking ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Respond with 'ACCESS GRANTED'");
            const text = result.response.text();
            console.log(`✅ ${modelName} VALID: ${text}`);
            // If one works, we are good
            return;
        } catch (e) {
            console.warn(`❌ ${modelName} Failed: ${e.message}`);
        }
    }

    console.error("💀 ALL MODELS FAILED. Key may be invalid or API not enabled.");
}

verifyKey();
