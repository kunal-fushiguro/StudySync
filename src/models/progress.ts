import { Schema, model, models } from "mongoose";

const ProgressTracker = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    progressDays: [
      {
        id: {
          type: Schema.Types.ObjectId,
          ref: "tracker",
        },
      },
    ],
  },
  { timestamps: true }
);

export const StudyPlan = models.progess || model("progess", ProgressTracker);
