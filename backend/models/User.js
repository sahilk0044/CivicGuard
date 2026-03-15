import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    mobile: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "user",
    },

    emergencyContacts: [
      {
        name1: {
          type: String,
          
        },
        email:{
          type:String,
          
        },
        phone: {
          type: String,
          required: true,
        },
        relationship: {
          type: String,
        },
      },
    ],

    alerts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Alert",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);