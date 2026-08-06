import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    organisation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required:true
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required:true
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    deadline: {
      type: Date,
    },

    hoursLogged: {
      type: Number,
      default: 0, 
    },

    tags:[
      {
        type:String,
      }
    ]
  },
  { timestamps: true },
);

export const Task = mongoose.model("Task",taskSchema);