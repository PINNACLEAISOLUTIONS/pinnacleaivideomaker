const axios = require("axios");
const fs = require("fs");
const path = require("path");

const BLUEPRINT_PATH = path.join(__dirname, "public", "blueprint.json");
const ASSETS_DIR = path.join(__dirname, "public", "assets");

if (!fs.existsSync(ASSETS_DIR)) {
    fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

async function downloadImage(url, filepath) {
    console.log(`⏳ Downloading -> ${filepath}...`);
    const writer = fs.createWriteStream(filepath);
    const response = await axios({
        url,
        method: "GET",
        responseType: "stream",
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on("finish", () => {
            const stats = fs.statSync(filepath);
            if (stats.size < 50000) { // 50KB min
                console.warn(`⚠️ Small file detected (${stats.size} bytes). Retrying might be needed.`);
            }
            resolve();
        });
        writer.on("error", reject);
    });
}

async function generateAllAssets() {
    console.log("🚀 [HELIOS] Asset Factory V2 (Level 9 Architect Mode)...");

    if (!fs.existsSync(BLUEPRINT_PATH)) {
        console.error("❌ blueprint.json missing.");
        return;
    }

    const blueprint = JSON.parse(fs.readFileSync(BLUEPRINT_PATH, "utf-8"));
    const timeline = blueprint.timeline;

    for (const segment of timeline) {
        const filename = `clip-${segment.id}.jpg`;
        const filepath = path.join(ASSETS_DIR, filename);

        let finalPrompt = "";
        if (segment.type === "STOCK") {
            // Transform stock search term into a high-end photographic prompt
            finalPrompt = `Hyper-realistic professional stock photo: ${segment.search_term}. 
            Extremely detailed, 8k resolution, cinematic lighting, vertical 9:16 aspect ratio, high-end photography.`;
        } else {
            // Use generating prompt with high-fidelity tags
            finalPrompt = `${segment.visual_prompt}. 
            Cyberpunk aesthetic, 8k resolution, cinematic lighting, unreal engine 5, raytracing, vertical 9:16 aspect ratio.`;
        }

        const encodedPrompt = encodeURIComponent(finalPrompt);
        const imageUrl = `https://pollinations.ai/p/${encodedPrompt}?width=1080&height=1920&model=flux`;

        console.log(`🎬 Processing Segment ${segment.id} (${segment.type})...`);
        try {
            await downloadImage(imageUrl, filepath);
            segment.asset = `assets/${filename}`;
        } catch (e) {
            console.error(`❌ Failed to generate asset for segment ${segment.id}:`, e.message);
        }
    }

    // Update blueprint with asset paths
    fs.writeFileSync(BLUEPRINT_PATH, JSON.stringify(blueprint, null, 2));
    console.log("✅ All assets generated and blueprint.json updated.");
}

generateAllAssets();
