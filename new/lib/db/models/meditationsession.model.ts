import mongoose from "mongoose";

interface IMeditationSession extends mongoose.Document {
  userId: mongoose.Types.ObjectId;

  meditationScript: string;
}
const meditationSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    meditationScript: { type: String, required: true },
  },
  { timestamps: true }
);

const MeditationSession =
  mongoose.models.MeditationSession ||
  mongoose.model("MeditationSession", meditationSessionSchema);

export default MeditationSession;
export type { IMeditationSession };
