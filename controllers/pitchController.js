
import Groq from "groq-sdk";
import Pitch from "../models/pitch.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

function buildRefinePrompt(form) {
  return `
You are a startup pitch coach.

Refine this pitch for an explore page.
Be clear, persuasive, concise.
Do not invent facts.

Startup Name: ${form.startupName}
Tagline: ${form.tagline}
Problem: ${form.problem}
Solution: ${form.solution}
Audience: ${form.audience}
Uniqueness: ${form.uniqueness}
Stage: ${form.stage}
Ask: ${form.ask}
`;
}
export const getExploreFeed = async (req, res) => {
  try {
    const posts = await Pitch.find({ published: true })
      .sort({ createdAt: -1 })
      .lean();

    res.json(posts);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Explore fetch failed" });
  }
};

export const refinePitch = async (req, res) => {
  const prompt = buildRefinePrompt(req.body);

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }]
  });

  res.json({
    refined: completion.choices[0].message.content
  });
};

export const getPitch = async (req, res) => {
  const pitch = await Pitch.findOne({
    startupId: req.params.startupId
  });

  res.json(pitch);
};

export const savePitchDraft = async (req, res) => {
  const { startupId, form, refinedText } = req.body;

  const pitch = await Pitch.findOneAndUpdate(
    { startupId },
    { startupId, form, refinedText },
    { upsert: true, new: true }
  );

  res.json(pitch);
};

export const publishPitch = async (req, res) => {
  const { startupId, chosenText } = req.body;

  const pitch = await Pitch.findOneAndUpdate(
    { startupId },
    { chosenText, published: true },
    { new: true }
  );

  res.json(pitch);
};
// controllers/pitchController.js



export const uploadPitchMedia = async (req, res) => {
  try {
    console.log("===== MEDIA UPLOAD HIT =====");
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const { startupId } = req.body;

    if (!startupId) {
      console.error("❌ startupId missing");
      return res.status(400).json({ message: "startupId missing" });
    }

    if (!req.files || (!req.files.image && !req.files.video)) {
      console.error("❌ No files received by multer");
      return res.status(400).json({ message: "No files uploaded" });
    }

    const update = {};

    if (req.files?.image?.[0]) {
      console.log("⬆ Uploading IMAGE to Cloudinary...");
      const imageResult = await uploadToCloudinary(
        req.files.image[0].buffer,
        {
          folder: "pitches/images",
          resource_type: "image"
        }
      );
      console.log("✅ IMAGE UPLOADED:", imageResult.secure_url);
      update.imageUrl = imageResult.secure_url;
    }

    if (req.files?.video?.[0]) {
      console.log("⬆ Uploading VIDEO to Cloudinary...");
      const videoResult = await uploadToCloudinary(
        req.files.video[0].buffer,
        {
          folder: "pitches/videos",
          resource_type: "video"
        }
      );
      console.log("✅ VIDEO UPLOADED:", videoResult.secure_url);
      update.videoUrl = videoResult.secure_url;
    }

    console.log("📝 Updating Pitch with:", update);

    const pitch = await Pitch.findOneAndUpdate(
      { startupId },
      update,
      { new: true, upsert: true }
    );

    console.log("✅ PITCH UPDATED");

    res.json(pitch);
  } catch (err) {
    console.error("🔥 MEDIA UPLOAD ERROR:", err);
    res.status(500).json({ message: "Media upload failed" });
  }
};
