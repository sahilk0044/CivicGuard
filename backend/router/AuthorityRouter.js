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

import authorityMiddleware from "../middleware/authorityMiddleware.js";
import upload from "../middleware/upload.js";

const AuthorityRouter = express.Router();

/* ================= AUTHORITY AUTH ================= */


AuthorityRouter.post("/authority-login", loginAuthority);  //post /api/authority/login

/* ================= VIEW ALERTS ================= */

AuthorityRouter.get("/alerts", authorityMiddleware, getAuthorityAlerts);  //get /api/authority/alerts

/* ================= RESOLVE ALERT ================= */

AuthorityRouter.put("/resolve/:id", authorityMiddleware, resolveAlert);  //put /api/authority/resolve/:id
AuthorityRouter.get("/authorities",getAllAuthorities);
AuthorityRouter.delete("/authorities/:id",deleteAuthority);
/* ================= AUTHORITY PROFILE ================= */

AuthorityRouter.get(
  "/profile",
  authorityMiddleware,
  getAuthorityProfile
);

AuthorityRouter.put(
  "/profile",
    upload.single("profileImage"),
  authorityMiddleware,
  updateAuthorityProfile
);

export default AuthorityRouter;