import { mergeAudioFiles } from "./ttsaudios/joining.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";
import { generateAudioFromText } from "../tts.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function processAudio(
  meditationScript,
  userId,
  bgmusic = "no-sound"
) {
  const userDirectory = path.join(__dirname, "merged_audio", userId);
  const tempBgDirectory = path.join(__dirname, "tempbg");

  try {
    const { voiceoverFile, bgMusicFile } = await generateAudioFromText(
      meditationScript,
      userId,
      bgmusic
    );

    let finalAudioFile = null;

    if (bgMusicFile && bgMusicFile !== "no-sound") {
      console.log(`Merging voiceover with background music: ${bgMusicFile}`);
      finalAudioFile = path.join(userDirectory, "1.mp3");

      let tempBgMusicPath = path.join(
        tempBgDirectory,
        `${Date.now()}_temp_bgmusic.mp3`
      );

      if (!fs.existsSync(tempBgDirectory)) {
        fs.mkdirSync(tempBgDirectory, { recursive: true });
      }

      finalAudioFile = await mergeAudioFiles(
        bgMusicFile,
        voiceoverFile,
        finalAudioFile,
        tempBgMusicPath
      );

      console.log(
        "Audio processing completed successfully with background music."
      );
    } else {
      console.log(
        `No background music selected. Voiceover saved as: ${voiceoverFile}`
      );
      finalAudioFile = voiceoverFile;
    }

    if (!fs.existsSync(userDirectory)) {
      fs.mkdirSync(userDirectory, { recursive: true });
    }

    let counter = 1;
    let outputFilePath = path.join(userDirectory, `${counter}.mp3`);

    while (fs.existsSync(outputFilePath)) {
      counter++;
      outputFilePath = path.join(userDirectory, `${counter}.mp3`);
    }

    const parentDirectory = path.dirname(outputFilePath);
    if (!fs.existsSync(parentDirectory)) {
      fs.mkdirSync(parentDirectory, { recursive: true });
    }

    fs.renameSync(finalAudioFile, outputFilePath);

    console.log("File saved at:", outputFilePath);
  } catch (error) {
    console.error("Error in audio processing:", error);
  }
}
