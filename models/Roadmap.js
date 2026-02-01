import mongoose from "mongoose";

const roadmapSchema = new mongoose.Schema(
  {
    startupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Startup",
      required: true,
      unique: true // ONE roadmap per startup
    },

    content: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Roadmap", roadmapSchema);
