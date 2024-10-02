import { Schema, model, models } from "mongoose";

const StudyPlansSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    duration: {
      type: String,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    createdDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
    },
    tasks: [
      {
        type: Schema.Types.ObjectId,
        ref: "tasks",
      },
    ],
  },
  { timestamps: true }
);

export const StudyPlan =
  models.studyplans || model("studyplans", StudyPlansSchema);
