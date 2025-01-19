import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

ffmpeg.setFfmpegPath("C:\\ffmpeg\\bin\\ffmpeg.exe");
ffmpeg.setFfprobePath("C:\\ffmpeg\\bin\\ffprobe.exe");

export async function mergeAudioFiles(
  bgMusicPath,
  voiceoverPath,
  outputFileName,
  tempBgMusicPath
) {
  try {
    const outputDir = path.dirname(outputFileName);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const bgMusicDuration = await getAudioDuration(bgMusicPath);
    const voiceoverDuration = await getAudioDuration(voiceoverPath);

    let tempBgMusicPathUsed = bgMusicPath;

    if (bgMusicDuration > voiceoverDuration) {
      await trimAudio(bgMusicPath, tempBgMusicPath, voiceoverDuration);
      tempBgMusicPathUsed = tempBgMusicPath;
    }

    await new Promise((resolve, reject) => {
      ffmpeg()
        .input(tempBgMusicPathUsed)
        .input(voiceoverPath)
        .complexFilter([
          "[0:a]volume=0.8[a1]",
          "[1:a]atempo=1,atempo=0.8,volume=0.8[a2]",
          "[a1][a2]amix=inputs=2:duration=first:dropout_transition=2",
        ])
        .output(outputFileName)
        .on("end", resolve)
        .on("error", (err) => {
          console.error("Error during merging:", err);
          reject(err);
        })
        .run();
    });

    return path.resolve(outputFileName);
  } catch (error) {
    console.error("Error merging audio files:", error);
    throw error;
  }
}

function getAudioDuration(filePath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        resolve(metadata.format.duration);
      }
    });
  });
}

function trimAudio(inputPath, outputPath, duration) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .setDuration(duration)
      .output(outputPath)
      .on("end", resolve)
      .on("error", reject)
      .run();
  });
}
