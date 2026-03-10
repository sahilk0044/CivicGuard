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
      enum: ["police", "medical", "fire"],
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    location: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },

    role: {
      type: String,
      default: "authority",
    },
  },
  { timestamps: true }
);


/* ========= GEO INDEX FOR NEAREST AUTHORITY SEARCH ========= */

authoritySchema.index({
  "location.latitude": 1,
  "location.longitude": 1,
});


export default mongoose.model("Authority", authoritySchema);