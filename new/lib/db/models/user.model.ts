import mongoose, { Schema, model } from "mongoose";

export interface UserDocument {
  _id: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  image: string;
  emailVerified: Date;

  meditationPreferences: mongoose.Types.ObjectId[];

  accounts: mongoose.Types.ObjectId[];
  sessions: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Email is invalid",
      ],
    },
    password: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    image: {
      type: String,
      required: false,
    },
    emailVerified: {
      type: Date,
      default: null,
    },
    phone: {
      type: String,
      required: false,
    },
    accounts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
      },
    ],
    sessions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session",
      },
    ],
    meditationPreferences: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MeditationPreferences",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models?.User || model<UserDocument>("User", UserSchema);
export default User;
