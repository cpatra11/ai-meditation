import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const audiofiles = [
  {
    bgmusic: {
      ambient: [
        "ambient-1",
        "ambient-2",
        "ambient-3",
        "ambient-4",
        "ambient-5",
        "ambient-6",
      ],
      nature: ["nature-1", "nature-2", "nature-3", "nature-4"],
      binaural: [
        "binaural-1",
        "binaural-2",
        "binaural-3",
        "binaural-4",
        "binaural-5",
        "binaural-6",
      ],
    },
  },
];

function getBackgroundMusicPath(type) {
  let musicPath = null;

  // Correct the base path to include 'server' in the directory
  const basePath = path.join(__dirname, "..", "server", "public", "bgmusic");

  if (type === "ambient-music") {
    const ambientMusic = audiofiles[0].bgmusic.ambient;
    if (ambientMusic && ambientMusic.length > 0) {
      const randomIndex = Math.floor(Math.random() * ambientMusic.length);
      const selectedMusic = ambientMusic[randomIndex];
      musicPath = path.join(basePath, "ambience", `${selectedMusic}.mp3`); // Corrected path
    }
  } else if (type === "nature-sounds") {
    const natureMusic = audiofiles[0].bgmusic.nature;
    if (natureMusic && natureMusic.length > 0) {
      const randomIndex = Math.floor(Math.random() * natureMusic.length);
      const selectedMusic = natureMusic[randomIndex];
      musicPath = path.join(basePath, "nature", `${selectedMusic}.mp3`); // Corrected path
    }
  } else if (type === "binaural-beats") {
    const binauralMusic = audiofiles[0].bgmusic.binaural;
    if (binauralMusic && binauralMusic.length > 0) {
      const randomIndex = Math.floor(Math.random() * binauralMusic.length);
      const selectedMusic = binauralMusic[randomIndex];
      musicPath = path.join(basePath, "binaural", `${selectedMusic}.mp3`); // Corrected path
    }
  }

  console.log(`Generated music path: ${musicPath}`);

  if (musicPath && fs.existsSync(musicPath)) {
    console.log(`Selected background music: ${musicPath}`);
    return musicPath;
  } else {
    console.log(`Audio file not found at path: ${musicPath}`);
    return null;
  }
}

export async function generateAudioFromText(
  text,
  userId,
  bgMusicType = "no-sound"
) {
  try {
    // console.log("RAPID_API_KEY:", process.env.RAPID_API_KEY); // Debug the API Key

    const options = {
      method: "POST",
      headers: {
        "x-rapidapi-key": `${process.env.RAPID_API_KEY}`,
        "x-rapidapi-host": "realistic-text-to-speech.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        voice_obj: {
          id: 2014,
          voice_id: "en-US-Neural2-A",
          gender: "Male",
          language_code: "en-US",
          language_name: "US English",
          voice_name: "John",
          status: 2,
          type: "google_tts",
          isPlaying: false,
        },
        json_data: [
          {
            block_index: 0,
            text: text,
          },
        ],
      }),
    };

    const url =
      "https://realistic-text-to-speech.p.rapidapi.com/v3/generate_voice_over_v2";
    const response = await fetch(url, options);

    if (response.ok) {
      const result = await response.json();

      if (result && result[0] && result[0].link) {
        const voiceoverUrl = result[0].link;

        // Fetch the generated voiceover file
        const audioResponse = await fetch(voiceoverUrl);
        const audioArrayBuffer = await audioResponse.arrayBuffer();
        const audioBuffer = Buffer.from(audioArrayBuffer);

        // Create a dynamic user folder for storing voiceover in the 'ttsaudios' directory
        const userFolderPath = path.join(__dirname, "ttsaudios", userId);
        if (!fs.existsSync(userFolderPath)) {
          fs.mkdirSync(userFolderPath, { recursive: true });
        }

        // Save the voiceover file with a dynamic filename based on timestamp
        const audioId = Date.now();
        const voiceoverFile = path.join(
          userFolderPath,
          `${userId}-${audioId}.mp3`
        );
        fs.writeFileSync(voiceoverFile, audioBuffer);
        console.log(`Voiceover saved successfully: ${voiceoverFile}`);

        let bgMusicFile = null;

        if (bgMusicType !== "no-sound") {
          bgMusicFile = getBackgroundMusicPath(bgMusicType); // Fetch background music path based on type
          if (!bgMusicFile) {
            console.log("No background music found for the selected type.");
          }
        }

        return { voiceoverFile, bgMusicFile }; // Return both files
      } else {
        throw new Error("No audio URL found in the API response.");
      }
    } else {
      throw new Error(`Failed to generate audio: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error generating or saving audio:", error);
    throw error; // Rethrow the error to be handled at the route level
  }
}
