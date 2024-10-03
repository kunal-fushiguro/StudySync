import { Schema, model, models } from "mongoose";

const ProgressTracker = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    progressDays: [
      {
        type: Schema.Types.ObjectId,
        ref: "tracker",
      },
    ],
    total: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Progess = models.progess || model("progess", ProgressTracker);
