import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({

  /* SYSTEM CONFIGURATION */

  systemName: {
    type: String,
    default: "CivicGuard"
  },

  emergencyEmail: {
    type: String,
    default: "admin@civicguard.com"
  },

  notifications: {
    type: Boolean,
    default: true
  },

  autoAssignAuthority: {
    type: Boolean,
    default: true
  },


  /* ALERT SECURITY */

  alertCooldownSeconds: {
    type: Number,
    default: 30
  },


  /* AUTHORITY DISPATCH */

  authorityRadiusKm: {
    type: Number,
    default: 10
  },

  autoDispatch: {
    type: Boolean,
    default: true
  },


  /* SYSTEM LOGGING */

  enableActivityLogs: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;