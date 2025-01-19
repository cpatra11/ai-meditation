import mongoose, { Schema, Document } from "mongoose";

interface IMeditationPreferences extends Document {
  userId: mongoose.Types.ObjectId;
  mentalHealthGoal: string;
  sessionLength: string;
  meditationType: string[];
  toneOfVoice: string;
  backgroundMusic: string[];
  frequency?: string;
  meditationSessions: mongoose.Types.ObjectId[];
}

const MeditationPreferencesSchema: Schema<IMeditationPreferences> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    mentalHealthGoal: {
      type: String,
      required: true,
      enum: [
        "stress-relief",
        "focus",
        "relaxation",
        "emotional-healing",
        "mindfulness",
        "general-well-being",
      ],
    },
    sessionLength: {
      type: String,
      required: true,
      enum: ["very-short", "short", "medium", "long"],
    },
    meditationType: {
      type: [Schema.Types.String],
      required: true,
      enum: [
        "guided",
        "breathing",
        "body-scan",
        "visualization",
        "mantra",
        "sound-healing",
      ],
    },
    toneOfVoice: {
      type: String,
      required: true,
      enum: ["calm", "energetic", "neutral"],
    },
    backgroundMusic: {
      type: [String],
      required: true,
      enum: ["nature-sounds", "ambient-music", "binaural-beats", "silent"],
    },
    frequency: {
      type: String,
      required: false,
      enum: ["daily", "weekly", "monthly"],
    },
    meditationSessions: [
      {
        type: Schema.Types.ObjectId,
        ref: "MeditationSession",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const MeditationPreferences =
  mongoose.models.MeditationPreferences ||
  mongoose.model<IMeditationPreferences>(
    "MeditationPreferences",
    MeditationPreferencesSchema
  );

export default MeditationPreferences;
