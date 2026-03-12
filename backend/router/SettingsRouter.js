import express from "express";
import { getSettings, updateSettings } from "../controller/SettingsController.js";

const SettingsRouter = express.Router();

SettingsRouter.get("/settings", getSettings);

SettingsRouter.put("/settings", updateSettings);

export default SettingsRouter;