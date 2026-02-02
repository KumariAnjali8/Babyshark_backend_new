import express from "express";
import {
  refinePitch,
  getPitch,
  savePitchDraft,
  publishPitch,
  getExploreFeed,uploadPitchMedia 
} from "../controllers/pitchController.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

/* ✅ SPECIFIC FIRST */
router.get("/explore/feed", getExploreFeed);

/* other fixed routes */
router.post("/refine", refinePitch);
router.post("/save", savePitchDraft);
router.post("/publish", publishPitch);
router.post(
  "/media",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 }
  ]),
  uploadPitchMedia
);
/* ✅ PARAM ROUTE LAST */
router.get("/:startupId", getPitch);

export default router;
