import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    organisation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organisation",
      required:true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required:true,
    },

    text: {
      type: String,
      required:true,
    },

    type: {
      type: String,
      enum: ["task_assigned", "mention", "system_alert", "message"], 
      default: "system_alert"
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const Notification = mongoose.model("Notification",notificationSchema);
