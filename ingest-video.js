const youtubedl = require('youtube-dl-exec');
const fs = require('fs');
const path = require('path');

const url = process.argv[2];

if (!url) {
    console.error("❌ Please provide a URL: npm run grab <video-url>");
    process.exit(1);
}

const outputDir = path.resolve(__dirname, 'public');
const outputFile = path.join(outputDir, 'video-source.mp4');

console.log("⬇️ Downloading...", url);

youtubedl(url, {
    output: outputFile,
    format: 'mp4',
    noCheckCertificates: true,
    noWarnings: true,
    preferFreeFormats: true,
    addHeader: [
        'referer:google.com',
        'user-agent:googlebot'
    ]
}).then(output => {
    console.log("✅ Ready for Anti-Gravity!");
    console.log(`Saved to: ${outputFile}`);
}).catch(err => {
    console.error("❌ Download failed:", err);
    if (err.stdout) console.error("STDOUT:", err.stdout);
    if (err.stderr) console.error("STDERR:", err.stderr);
    process.exit(1);
});
