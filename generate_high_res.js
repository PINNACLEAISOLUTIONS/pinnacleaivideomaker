const fs = require("fs");
const path = require("path");
const axios = require("axios");

// Configuration
const PLAN_PATH = path.join(__dirname, "public", "hybrid_plan.json");
const ASSETS_DIR = path.join(__dirname, "public", "assets");

if (!fs.existsSync(ASSETS_DIR)) {
    fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

async function downloadImage(url, filepath) {
    const response = await axios({
        url,
        method: "GET",
        responseType: "stream",
        timeout: 60000,
    });

    return new Promise((resolve, reject) => {
        const writer = fs.createWriteStream(filepath);
        response.data.pipe(writer);
        writer.on("finish", resolve);
        writer.on("error", reject);
    });
}

function getFluxUrl(prompt) {
    const encodedPrompt = encodeURIComponent(prompt);
    // Explicitly using Flux model as per protocol
    return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1080&height=1920&model=flux&nologo=true`;
}

async function generateHighResFactory() {
    console.log("🎬 [HELIOS] Activating Asset Factory (High-Res 4K)...");

    if (!fs.existsSync(PLAN_PATH)) {
        console.error("❌ High-res plan missing! Run 'node analyze_full.js' first.");
        return;
    }

    const data = JSON.parse(fs.readFileSync(PLAN_PATH, "utf-8"));
    const segments = data.segments || [];

    for (let i = 0; i < segments.length; i++) {
        const seg = segments[i];
        if (seg.type !== "REPLACE") continue;

        const filename = `high-res-${i}.jpg`;
        const filePath = path.join(ASSETS_DIR, filename);
        const publicPath = `assets/${filename}`;

        // Protocol: Verification Rule - Retry if small
        let success = false;
        let attempts = 0;
        const maxAttempts = 3;

        while (!success && attempts < maxAttempts) {
            attempts++;
            console.log(`🖌️ Generating Asset ${i} (Attempt ${attempts}): "${seg.visual_prompt.substring(0, 50)}..."`);

            const url = getFluxUrl(seg.visual_prompt);

            try {
                await downloadImage(url, filePath);
                const stats = fs.statSync(filePath);
                const fileSizeKB = stats.size / 1024;

                if (fileSizeKB < 50) {
                    console.warn(`⚠️ Asset ${i} too small (${fileSizeKB.toFixed(1)}KB). Retrying...`);
                    fs.unlinkSync(filePath);
                } else {
                    console.log(`✅ Asset ${i} Verified: ${fileSizeKB.toFixed(1)}KB`);
                    seg.asset = publicPath;
                    success = true;
                }
            } catch (error) {
                console.error(`❌ Factory Error on Asset ${i}:`, error.message);
                await new Promise(r => setTimeout(r, 2000));
            }
        }

        if (!success) {
            console.error(`🛑 Failed to generate high-res asset for segment ${i} after ${maxAttempts} attempts.`);
        }

        // Save progress incrementally
        fs.writeFileSync(PLAN_PATH, JSON.stringify(data, null, 2));
    }

    console.log("✨ Asset Factory operation complete.");
}

generateHighResFactory();
