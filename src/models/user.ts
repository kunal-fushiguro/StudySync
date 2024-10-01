import { Schema, Types, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    code: {
      type: Number,
      default: 0,
    },
    profilePic: {
      type: String,
    },
    themes: {
      type: String,
    },
    banckgroundImg: {
      type: String,
    },
    studyPlans: [
      {
        studyPlansId: {
          type: Schema.Types.ObjectId,
          ref: "studyplans",
        },
      },
    ],
  },
  { timestamps: true }
);

export const Users = models.users || model("users", UserSchema);
