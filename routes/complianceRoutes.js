import express from "express";
import {
  getLicenses,
  getComplianceDashboard,
  updateComplianceStatus
} from "../controllers/complianceController.js";

const router = express.Router();

router.get("/licenses/:startupId", getLicenses);
router.get("/dashboard/:startupId", getComplianceDashboard);
router.patch(
  "/status/:startupId/:licenseId",
  updateComplianceStatus
);

export default router;
