import mongoose, { Schema, models, model } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String },
    email: { type: String, unique: true, required: true, index: true },
    image: { type: String },
    passwordHash: { type: String },
    provider: { type: String, default: "credentials" },
  },
  { timestamps: true }
);

export type IUser = {
  _id: string;
  name?: string;
  email: string;
  image?: string;
  passwordHash?: string;
  provider?: string;
};

export const User = models.User || model("User", UserSchema);


