const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
    const key = "AIzaSyDTTue44_dDXdP_s_-7ETtalTOuTgjBdgs";
    try {
        const genAI = new GoogleGenerativeAI(key);
        // SDK doesn't have a direct listModels, but we can try to hit the root or check if we can generate with a known alternative
        console.log("Checking gemini-1.5-flash-8b...");
        const model8b = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });
        const res8b = await model8b.generateContent("test");
        console.log("8b Success!");
    } catch (e) {
        console.error("8b Failed:", e.message);
        try {
            console.log("Checking gemini-pro...");
            const modelPro = genAI.getGenerativeModel({ model: "gemini-pro" });
            const resPro = await modelPro.generateContent("test");
            console.log("Pro Success!");
        } catch (e2) {
            console.error("Pro Failed:", e2.message);
        }
    }
}

listModels();
