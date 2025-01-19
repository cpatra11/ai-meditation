import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { processAudio } from "../audio-service/processAudio.js";

import path, { dirname } from "path";
import fs from "fs";
import { fileURLToPath } from "url";
const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

router.post("/audio", authMiddleware, async (req, res) => {
  const { meditationScript, userId, bgmusic } = req.body;

  res.json({ message: "Audio generation started." });

  try {
    await processAudio(meditationScript, userId, bgmusic);
  } catch (error) {
    console.error("Error generating audio:", error);
  }
});

router.post("/audioo", authMiddleware, (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    console.error("User ID is required but not provided.");
    return res.status(400).json({ message: "User ID is required." });
  }

  console.log("User ID:", userId);

  const userDirectoryPath = path.join(
    __dirname,
    "..",
    "audio-service",
    "merged_audio",
    userId
  );

  console.log("User directory path:", userDirectoryPath);
  if (fs.existsSync(userDirectoryPath)) {
    const audioFiles = fs
      .readdirSync(userDirectoryPath)
      .filter((file) => file.endsWith(".mp3"))
      .sort((a, b) => parseInt(b) - parseInt(a));

    if (audioFiles.length === 0) {
      return res.status(404).json({ message: "No audio files found." });
    }

    const latestFile = audioFiles[0];

    res.setHeader("Content-Type", "audio/mp3");
    res.setHeader("Content-Disposition", `attachment; filename=${latestFile}`);
    fs.createReadStream(path.join(userDirectoryPath, latestFile)).pipe(res);
  } else {
    return res.status(404).json({ message: "User directory not found." });
  }
});

// router.get("/audio/:userId", authMiddleware, (req, res) => {
//   const { userId } = req.params;
//   const userDirectoryPath = path.join(__dirname, "..", "ttsaudios", userId);

//   if (fs.existsSync(userDirectoryPath)) {
//     const audioFiles = fs
//       .readdirSync(userDirectoryPath)
//       .filter((file) => file.endsWith(".mp3"));

//     if (audioFiles.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No audio files found for this user." });
//     }

//     res.json({
//       userId: userId,
//       audioFiles: audioFiles,
//     });
//   } else {
//     return res.status(404).json({ message: "User directory not found." });
//   }
// });

// router.get("/audio/:userId/:fileName", authMiddleware, (req, res) => {
//   const { userId, fileName } = req.params;
//   const audioFilePath = path.join(
//     __dirname,
//     "..",
//     "ttsaudios",
//     userId,
//     fileName
//   );

//   if (fs.existsSync(audioFilePath)) {
//     res.setHeader("Content-Type", "audio/mpeg");
//     res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

//     const audioStream = fs.createReadStream(audioFilePath);
//     audioStream.pipe(res);
//   } else {
//     res.status(404).json({ message: "Audio file not found." });
//   }
// });

export default router;
