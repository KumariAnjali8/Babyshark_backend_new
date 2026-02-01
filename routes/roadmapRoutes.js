import express from "express";
import { getOrCreateRoadmap } from "../controllers/roadmapController.js";

const router = express.Router();

router.get("/:startupId", getOrCreateRoadmap);

export default router;
