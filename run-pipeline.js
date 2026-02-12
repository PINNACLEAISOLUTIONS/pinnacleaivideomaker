const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function runCommand(command, description) {
    console.log(`\n🚀 [Step: ${description}]`);
    console.log(`> ${command}`);
    try {
        execSync(command, { stdio: 'inherit' });
        console.log(`✅ ${description} Complete.`);
    } catch (error) {
        console.error(`❌ ${description} Failed!`);
        process.exit(1);
    }
}

async function main() {
    console.log("==========================================");
    console.log("   🧬 HELIOS HYBRID VIDEO PIPELINE       ");
    console.log("   (Keep UI + Replace Filler)            ");
    console.log("==========================================");

    // 1. Analyze (Hybrid Brain)
    runCommand("node analyze_hybrid.js", "AI Analysis (Hybrid Segmentation)");

    // 2. Generate (The Fillers)
    runCommand("node generate_fillers.js", "Filler Asset Generation");

    // 3. Render (The Output)
    const outputDir = path.join(__dirname, "out");
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    runCommand("npx remotion render WorkBench out/hybrid-video.mp4", "Final Hybrid Rendering");

    console.log("\n==========================================");
    console.log("✨ HYBRID REMAKE COMPLETE. ✨");
    console.log("📁 Output: out/hybrid-video.mp4");
    console.log("==========================================");
}

main();
