import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      
    },

    latitude: {
      type: Number,
      required: true,
    },

    longitude: {
      type: Number,
      required: true,
    },

    video: {
      type: String, // video file path
    },

    status: {
      type: String,
      enum: ["active", "resolved"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Alert", alertSchema);