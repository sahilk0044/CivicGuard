import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    authority: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Authority",
      default: null,
    },

    /* ALERT TYPE → used to match department */

    type: {
      type: String,
      enum: ["police", "medical", "fire"],
      required: true,
    },

    latitude: {
      type: Number,
      required: true,
    },

    longitude: {
      type: Number,
      required: true,
    },

    locationName: {
      type: String, // optional readable location
    },

    video: {
      type: String, // video file path
    },

    status: {
      type: String,
      enum: ["active", "assigned", "resolved"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Alert", alertSchema);