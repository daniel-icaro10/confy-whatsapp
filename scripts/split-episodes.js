const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const inputFile = "C:\\Users\\ANDRÉ\\Downloads\\Ganhei Três NamoradasDublado PTBR - Vídeo Dailymotion.mp4";
const outputDir = path.join(__dirname, "..", "public", "dramas", "ganhei-tres-namoradas");

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const totalEpisodes = 60;
const totalDuration = 2572.608;
const episodeDuration = totalDuration / totalEpisodes; // ~42.8768 seconds

console.log(`Starting slice of 60 episodes from: ${inputFile}`);
console.log(`Output directory: ${outputDir}`);
console.log(`Episode duration: ${episodeDuration.toFixed(2)}s\n`);

const startTimeAll = Date.now();

for (let i = 1; i <= totalEpisodes; i++) {
    const start = (i - 1) * episodeDuration;
    const outputFile = path.join(outputDir, `ep-${i}.mp4`);
    
    // Command with veryfast preset and faststart for instant streaming
    const cmd = `ffmpeg -y -ss ${start.toFixed(3)} -i "${inputFile}" -t ${episodeDuration.toFixed(3)} -c:v libx264 -preset veryfast -crf 26 -c:a aac -b:a 96k -movflags +faststart "${outputFile}"`;

    const epStart = Date.now();
    try {
        execSync(cmd, { stdio: "ignore" });
        const stat = fs.statSync(outputFile);
        const sizeMb = (stat.size / (1024 * 1024)).toFixed(2);
        const durationSec = ((Date.now() - epStart) / 1000).toFixed(1);
        console.log(`[${i}/${totalEpisodes}] ep-${i}.mp4 created (${sizeMb} MB) in ${durationSec}s`);
    } catch (err) {
        console.error(`Error encoding ep-${i}:`, err.message);
    }
}

const totalSec = ((Date.now() - startTimeAll) / 1000).toFixed(1);
console.log(`\nAll ${totalEpisodes} episodes generated successfully in ${totalSec}s!`);

