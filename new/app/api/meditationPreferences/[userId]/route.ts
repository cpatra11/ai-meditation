import MeditationPreferences from "@/lib/db/models/meditation.model";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(params) {
  const userId = params.url.split("/").pop();
  console.log(userId);
  try {
    await mongoose.connect(process.env.MONGODB_URI || "");

    const preferences = await MeditationPreferences.find({ userId });

    return NextResponse.json(preferences, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: 405,
      error: "Could not fetch preferences",
    });
  }
}
