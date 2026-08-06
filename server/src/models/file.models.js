import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    organisation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organisation",
      required:true,
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required:true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required:true,
    },

    fileName: {
      type: String,
      required:true,
    },

    fileUrl: {
      type: String,
      required:true,
    },

    fileType: {
      type: String,
    },

    size: {
      type: Number,
    },
  },
  { timestamps: true },
);

export const File = mongoose.model("File",fileSchema);