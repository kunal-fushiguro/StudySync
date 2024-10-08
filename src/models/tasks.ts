import { Schema, model, models } from "mongoose";

const StudyPlansSchema = new Schema(
  {
    studyPlanId: {
      type: Schema.Types.ObjectId,
      ref: "studyplans",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    priority: {
      type: String,
      required: true,
    },
    dueDate: {
      type: String,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    minutes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Tasks = models.tasks || model("tasks", StudyPlansSchema);
