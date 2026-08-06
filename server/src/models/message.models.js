import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    organisation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organisation",
      required:true,
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required:true,
    },

    receiver: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    message: {
      type: String,
      required: true,
    },

    attachments: [String],
  },
  { timestamps: true },
);

export const Message = mongoose.model("Message",messageSchema);