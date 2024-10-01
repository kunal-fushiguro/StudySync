import { Schema, model, models } from "mongoose";

const ProgressTracker = new Schema(
  {
    minutes: {
      type: Number,
    },
    date: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Tracker = models.progess || model("progess", ProgressTracker);
