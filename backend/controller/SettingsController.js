import Settings from "../models/Settings.js";

/* ================= GET SETTINGS ================= */

export const getSettings = async (req, res) => {
  try {

    let settings = await Settings.findOne();

    /* If no settings exist, create default */

    if (!settings) {
      settings = await Settings.create({});
    }

    res.json(settings);

  } catch (error) {

    res.status(500).json({
      message: "Error fetching settings",
      error: error.message
    });

  }
};


/* ================= UPDATE SETTINGS ================= */

export const updateSettings = async (req, res) => {

  try {

    let settings = await Settings.findOne();

    /* If settings do not exist, create them */

    if (!settings) {

      settings = new Settings(req.body);

    } else {

      /* Update fields */

      settings.systemName = req.body.systemName;
      settings.emergencyEmail = req.body.emergencyEmail;
      settings.notifications = req.body.notifications;
      settings.autoAssignAuthority = req.body.autoAssignAuthority;
      settings.alertCooldownSeconds = req.body.alertCooldownSeconds;
      settings.authorityRadiusKm = req.body.authorityRadiusKm;
      settings.autoDispatch = req.body.autoDispatch;
      settings.enableActivityLogs = req.body.enableActivityLogs;

    }

    await settings.save();

    res.json({
      message: "Settings updated successfully",
      settings
    });

  } catch (error) {

    res.status(500).json({
      message: "Error updating settings",
      error: error.message
    });

  }

};