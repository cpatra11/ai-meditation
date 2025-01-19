"use server";

import { connect } from "mongoose";
import { auth } from "./auth";
import connectDB from "./db/mongoose";
import User from "./db/models/user.model";

export async function getUserId() {
  const data = await auth();

  await connectDB();

  const isExist = await User.findOne({ email: data?.user?.email });
  if (!isExist) {
    return `User not found`;
  }

  return isExist._id;
}
