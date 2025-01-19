import { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import MeditationPreferences from "@/lib/db/models/meditation.model";
import { NextResponse } from "next/server";
import User from "@/lib/db/models/user.model";

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const {
      userId,
      mentalHealthGoal,
      sessionLength,
      meditationType,
      toneOfVoice,
      backgroundMusic,
      frequency, // frequency is optional
    } = await req.json(); // Use req.json() instead of req.body()

    // Assuming you want to save to MongoDB:
    await mongoose.connect(process.env.MONGODB_URI || "");

    const newPreferences = new MeditationPreferences({
      userId,
      mentalHealthGoal,
      sessionLength,
      meditationType,
      toneOfVoice,
      backgroundMusic,
      frequency, // frequency can be undefined and still be saved
    });

    await newPreferences.save();
    await User.findByIdAndUpdate(userId, {
      $push: { meditationPreferences: newPreferences._id },
    });

    return NextResponse.json(
      { message: "Preferences saved successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: 405,
      error: "Could not save preferences",
    });
  }
}

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { userId } = req.json();

    await mongoose.connect(process.env.MONGODB_URI || "");

    const preferences = await MeditationPreferences.find({ userId });
    const createdAt = preferences.map((preference) => preference.createdAt);

    return NextResponse.json(preferences, createdAt, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: 405,
      error: "Could not fetch preferences",
    });
  }
}
