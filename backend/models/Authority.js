import mongoose from "mongoose";

const authoritySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phone: {
      type: String,
      required: true,
    },

    department: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    location: {
      latitude: Number,
      longitude: Number,
    },

    role: {
      type: String,
      default: "authority",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Authority", authoritySchema);