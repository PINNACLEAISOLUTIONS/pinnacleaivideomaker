const fs = require("fs");
const path = require("path");
const https = require("https");

// Configuration
const PLAN_PATH = path.join(__dirname, "public", "hybrid_plan.json");
const ASSETS_DIR = path.join(__dirname, "public", "assets");

if (!fs.existsSync(ASSETS_DIR)) {
    fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

async function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filepath);
        https
            .get(url, (response) => {
                if (response.statusCode !== 200) {
                    reject(
                        new Error(`Failed to download: ${response.statusCode}`)
                    );
                    return;
                }
                response.pipe(file);
                file.on("finish", () => {
                    file.close();
                    resolve();
                });
            })
            .on("error", (err) => {
                fs.unlink(filepath, () => { });
                reject(err);
            });
    });
}

function getPollinationsUrl(prompt) {
    const encodedPrompt = encodeURIComponent(prompt);
    return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1080&height=1920&model=flux&nologo=true`;
}

async function generateFillers() {
    console.log("🎨 Hybrid Filler Generator v2...");

    if (!fs.existsSync(PLAN_PATH)) {
        console.error("❌ No plan found! Run 'node analyze_hybrid.js' first.");
        return;
    }

    const rawPlan = JSON.parse(fs.readFileSync(PLAN_PATH, "utf-8"));

    // Support new dual-key format OR legacy flat array
    const visuals = rawPlan.visuals || rawPlan;
    const transcript = rawPlan.transcript || [];

    for (let i = 0; i < visuals.length; i++) {
        const segment = visuals[i];

        // ONLY process REPLACE segments
        if (segment.type !== "REPLACE") continue;

        // Skip if asset already exists
        if (
            segment.asset &&
            fs.existsSync(path.join(__dirname, "public", segment.asset))
        ) {
            console.log(
                `⏭️ Skipping existing: ${(segment.visual_prompt || "").substring(0, 20)}...`
            );
            continue;
        }

        const filename = `filler-${i}.jpg`;
        const filePath = path.join(ASSETS_DIR, filename);
        const publicPath = `assets/${filename}`;

        console.log(
            `🖌️ Generating Filler ${i}: "${(segment.visual_prompt || "unknown").substring(0, 40)}..."`
        );
        const url = getPollinationsUrl(segment.visual_prompt || "abstract tech");

        try {
            await downloadImage(url, filePath);
            console.log(`✅ Saved: ${filename}`);

            // Update the visuals array with the asset path
            segment.asset = publicPath;

            // Incremental save (preserving transcript)
            const output = rawPlan.visuals
                ? { visuals, transcript }
                : visuals;
            fs.writeFileSync(PLAN_PATH, JSON.stringify(output, null, 2));
        } catch (error) {
            console.error(`❌ Failed to generate:`, error.message);
        }
    }

    console.log("💾 Hybrid Assets Finalized.");
}

generateFillers();
