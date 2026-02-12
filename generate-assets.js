const fs = require("fs");
const path = require("path");
const https = require("https");

// Configuration
const PLAN_PATH = path.join(__dirname, "public", "content-map.json");
const ASSETS_DIR = path.join(__dirname, "public", "assets");

if (!fs.existsSync(ASSETS_DIR)) {
    fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

async function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filepath);
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download: ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(filepath);
            reject(err);
        });
    });
}

function getPollinationsUrl(prompt) {
    // Pollinations.ai API: https://image.pollinations.ai/prompt/{encoded_prompt}
    // We add params for size and quality if possible, but the path is the main thing.
    // We'll append a random seed to ensure uniqueness if needed, but for stability we might keep it constant.
    const encodedPrompt = encodeURIComponent(prompt);
    return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1920&height=1080&nologo=true&model=flux`;
}

async function generateAssets() {
    console.log("🎨 generator initialized...");

    if (!fs.existsSync(PLAN_PATH)) {
        console.error("❌ No plan found! Run 'node analyze-video.js' first.");
        return;
    }

    const plan = JSON.parse(fs.readFileSync(PLAN_PATH, "utf-8"));
    const updatedPlan = [];

    for (let i = 0; i < plan.length; i++) {
        const segment = plan[i];

        // Skip if already has asset
        if (segment.asset && fs.existsSync(path.join(__dirname, "public", segment.asset))) {
            console.log(`⏭️ Skipping existing: ${segment.keyword}`);
            updatedPlan.push(segment);
            continue;
        }

        const filename = `gen-${segment.start}-${segment.keyword.replace(/\s+/g, '-').toLowerCase()}.jpg`;
        const filePath = path.join(ASSETS_DIR, filename);
        const publicPath = `assets/${filename}`;

        console.log(`🖌️ Generating: "${segment.keyword}"...`);
        const url = getPollinationsUrl(segment.prompt);

        try {
            await downloadImage(url, filePath);
            console.log(`✅ Saved: ${filename}`);

            // Add asset path to the plan
            updatedPlan.push({
                ...segment,
                asset: publicPath
            });
        } catch (error) {
            console.error(`❌ Failed to generate ${segment.keyword}:`, error.message);
            // Fallback: keep segment but maybe mark as error or use placeholder?
            updatedPlan.push(segment);
        }

        // Save incrementally so we don't lose progress if a later one crashes
        fs.writeFileSync(PLAN_PATH, JSON.stringify(updatedPlan.concat(plan.slice(i + 1)), null, 2));
    }

    console.log("💾 Manifest Finalized: content-map.json");
}

generateAssets();
