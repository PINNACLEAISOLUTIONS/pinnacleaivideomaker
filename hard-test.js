const { GoogleGenerativeAI } = require("@google/generative-ai");

async function test() {
    const key = "AIzaSyDTTue44_dDXdP_s_-7ETtalTOuTgjBdgs";
    try {
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });
        const result = await model.generateContent("Say hello");
        console.log("Success:", result.response.text());
    } catch (e) {
        console.error("Hardcoded Test Failed:", e.message);
        if (e.status) console.log("Status:", e.status);
    }
}

test();
