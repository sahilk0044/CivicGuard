import express from "express";

import {
  loginAuthority,
  getAuthorityAlerts,
  resolveAlert,
  getAllAuthorities,
  deleteAuthority,
  getAuthorityProfile,
  updateAuthorityProfile,
} from "../controller/AuthorityController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const AuthorityRouter = express.Router();

/* ================= AUTHORITY AUTH ================= */


AuthorityRouter.post("/login", loginAuthority);  //post /api/authority/login

/* ================= VIEW ALERTS ================= */

AuthorityRouter.get("/alerts", authMiddleware, getAuthorityAlerts);  //get /api/authority/alerts

/* ================= RESOLVE ALERT ================= */

AuthorityRouter.put("/resolve/:id", authMiddleware, resolveAlert);  //put /api/authority/resolve/:id
AuthorityRouter.get("/authorities",getAllAuthorities);
AuthorityRouter.delete("/authorities/:id",deleteAuthority);
/* ================= AUTHORITY PROFILE ================= */

AuthorityRouter.get(
  "/profile",
  authMiddleware,
  getAuthorityProfile
);

AuthorityRouter.put(
  "/profile",
  authMiddleware,
  updateAuthorityProfile
);

export default AuthorityRouter;