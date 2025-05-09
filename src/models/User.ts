import mongoose, { Schema, Document } from "mongoose";
import Role from "./Role";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: "/unknown.webp", // Default profile picture URL
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      role: Role,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
