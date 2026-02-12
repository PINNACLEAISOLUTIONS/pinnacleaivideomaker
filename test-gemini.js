const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

async function test() {
    const key = process.env.GOOGLE_API_KEY;
    console.log("Key Length:", key ? key.length : "MISSING");
    console.log("Key starts with:", key ? key.substring(0, 7) : "MISSING");

    if (!key) return;

    try {
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Say hello");
        console.log("Success:", result.response.text());
    } catch (e) {
        console.error("Test Failed:", e.message);
        if (e.statusText) console.error("Status:", e.statusText);
    }
}

test();
