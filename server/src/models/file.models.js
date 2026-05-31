import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    fileName: {
      type: String,
    },

    fileUrl: {
      type: String,
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