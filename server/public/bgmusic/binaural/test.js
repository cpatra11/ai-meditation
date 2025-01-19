import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffmpegPath);

ffmpeg.ffprobe("binaural-1.mp3", function (err, metadata) {
  if (err) {
    console.error("Error fetching metadata:", err);
  } else {
    console.log("Metadata:", metadata);
  }
});
