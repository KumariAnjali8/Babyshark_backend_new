import mongoose from "mongoose";

const startupSchema = new mongoose.Schema(
  {
    startupName: {
      type: String
    },

    idea: {
      type: String,
      required: true
    },

    location: String,
    budget: String,
    audience: String,
    feasibility: {
      category: {
        type: String,
        enum: ["Food", "Tech", "Service", "Retail", "Manufacturing"],
        default: "Service",
        required: true
      },
      score: Number,
      justification: String,
      problem: String,
      existingSolutions: String,
      marketGap: String
    },

    // add inside startupSchema



    startupType: {
      type: String,
      enum: ["Tech", "Service", "Product", "NGO", "Marketplace", "Manufacturing"]
    },

    businessModel: {
      type: String,
      enum: ["Solo", "Partnership", "Pvt Ltd", "LLP"]
    },

    stage: {
      type: String,
      enum: ["Idea", "MVP", "Launched"]
    },

    complianceProgress: {
      type: Number,
      default: 0
    },

    collaborationUnlocked: {
      type: Boolean,
      default: false
    },

    status: {
      type: String,
      enum: ["draft", "promising", "active"],
      default: "draft"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Startup", startupSchema);
