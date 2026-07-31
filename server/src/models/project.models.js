import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    organisation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },

    title: {
      type: String,
      required: true,
    },

    taskCount:{
      type:Number,
      default:0
    },

    description: {
      type: String,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    status: {
      type: String,
      enum: ["active", "completed", "archived"],
      default: "active",
    },

    deadline: {
      type: Date,
    },
  },
  { timestamps: true },
);


export const Project = mongoose.model("Project",projectSchema);