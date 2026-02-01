import mongoose from "mongoose";

const pitchSchema = new mongoose.Schema(
  {
    startupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Startup",
      unique: true,
      required: true
    },

    form: {
      startupName: String,
      tagline: String,
      problem: String,
      solution: String,
      audience: String,
      uniqueness: String,
      stage: String,
      ask: String
    },

    refinedText: String,
    chosenText: String,

    imageUrl: String,
    videoUrl: String,

    published: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.model("Pitch", pitchSchema);
