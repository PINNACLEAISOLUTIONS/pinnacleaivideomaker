const fs = require("fs");
const path = require("path");
const axios = require("axios");

const LOGO_PATH = path.join(__dirname, "public", "logo.png");

async function generateBrandLogo() {
    console.log("💎 [HELIOS] Generating Enterprise Brand Logo (Flux)...");

    const prompt = "Minimalist 3D Golden Pyramid logo, vector style, white background, high quality, 8k";
    const encodedPrompt = encodeURIComponent(prompt);
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&model=flux&nologo=true`;

    try {
        const response = await axios({
            url,
            method: "GET",
            responseType: "stream",
            timeout: 60000,
        });

        const writer = fs.createWriteStream(LOGO_PATH);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on("finish", () => {
                console.log("✅ Enterprise Logo saved to public/logo.png");
                resolve();
            });
            writer.on("error", reject);
        });
    } catch (error) {
        console.error("❌ Logo Generation Failed:", error.message);
    }
}

generateBrandLogo();
