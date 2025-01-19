// app/api/getUserId/route.ts

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/lib/db/models/user.model";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email"); // Retrieve the email from the query string

  if (!email || typeof email !== "string") {
    return NextResponse.json(
      { message: "Invalid email parameter" },
      { status: 400 }
    );
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI || "");

    // Fetch user by email and return userId
    const user = await User.findOne({ email });

    if (user) {
      return NextResponse.json({ userId: user._id.toString() });
    } else {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching userId", error: error.message },
      { status: 500 }
    );
  }
}
