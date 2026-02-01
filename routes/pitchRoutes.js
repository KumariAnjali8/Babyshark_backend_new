import express from "express";
import {
  refinePitch,
  getPitch,
  savePitchDraft,
  publishPitch,
  getExploreFeed
} from "../controllers/pitchController.js";

const router = express.Router();

/* ✅ SPECIFIC FIRST */
router.get("/explore/feed", getExploreFeed);

/* other fixed routes */
router.post("/refine", refinePitch);
router.post("/save", savePitchDraft);
router.post("/publish", publishPitch);

/* ✅ PARAM ROUTE LAST */
router.get("/:startupId", getPitch);

export default router;
