import mongoose, { Schema, models, model } from "mongoose";

const WorldDesignSchema = new Schema(
  {
    userId: { type: String, index: true, required: true },
    name: { type: String, required: true },
    world: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export type IWorldDesign = {
  _id: string;
  userId: string;
  name: string;
  world: any;
};

export const WorldDesign = models.WorldDesign || model("WorldDesign", WorldDesignSchema);


