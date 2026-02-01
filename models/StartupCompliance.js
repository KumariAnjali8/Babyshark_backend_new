import mongoose from "mongoose";

const startupComplianceSchema = new mongoose.Schema({
  startupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Startup",
    required: true
  },
  licenseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "License",
    required: true
  },
  status: {
    type: String,
    enum: [
      "Not Started",
      "In Progress",
      "Applied",
      "Approved",
      "Needs Action"
    ],
    default: "Not Started"
  }
}, { timestamps: true });

export default mongoose.model(
  "StartupCompliance",
  startupComplianceSchema
);
