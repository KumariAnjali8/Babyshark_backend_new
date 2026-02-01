import "dotenv/config" 
import Roadmap from "../models/Roadmap.js";
import Startup from "../models/Startup.js";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const getOrCreateRoadmap = async (req, res) => {
  try {
    const { startupId } = req.params;

    // 1️⃣ Check DB first
    const existing = await Roadmap.findOne({ startupId });
    if (existing) {
      return res.json({ source: "db", roadmap: existing.content });
    }

    // 2️⃣ Fetch startup info
    const startup = await Startup.findById(startupId);
    if (!startup) {
      return res.status(404).json({ message: "Startup not found" });
    }

    // 3️⃣ Generate roadmap using AI
    const prompt = `
Create a detailed 90-day startup roadmap.

Startup Idea: ${startup.idea}
Location: ${startup.location}
Budget: ${startup.budget}
Target Audience: ${startup.audience}

Return plain text. Be structured.
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3
    });

    const roadmapText = completion.choices[0].message.content;

    // 4️⃣ Save to DB
    const roadmap = new Roadmap({
      startupId,
      content: roadmapText
    });

    await roadmap.save();

    // 5️⃣ Return
    res.json({ source: "ai", roadmap: roadmapText });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Roadmap generation failed" });
  }
};
