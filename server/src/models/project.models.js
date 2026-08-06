import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    organisation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required:true,
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

    health: {
      type: String,
      enum: ["Good", "Warning", "Critical"],
      default: "Good",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required:true
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    status: {
      type: String,
      enum: ["Planning", "In Progress", "On Hold", "Completed"],
      default: "Planning",
    },

    deadline: {
      type: Date,
    },
  },
  { timestamps: true },
);


export const Project = mongoose.model("Project",projectSchema);