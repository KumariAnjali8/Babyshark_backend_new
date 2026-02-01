// // import { getWeatherFromAPI } from "../services/weatherService.js";

// // export const getWeather = async (req, res) => {
// //   try {
// //     const city = req.query.city;
// //     const data = await getWeatherFromAPI(city);

// //     res.json({
// //       city: data.name,
// //       temperature: data.main.temp,
// //       weather: data.weather[0].description
// //     });
// //   } catch (error) {
// //     res.status(500).json({ message: "Weather fetch failed" });
// //   }
// // };
// import "dotenv/config";
// import Groq from "groq-sdk";
// import Startup from "../models/Startup.js";

// const groq = new Groq({
//   apiKey: process.env.GROQ_API_KEY
// });

// export const checkFeasibility = async (req, res) => {
 
//   try {
//     const { idea, location, budget, audience } = req.body;

//     const prompt = `
// You are a senior startup analyst with 10+ years of experience.

// Analyze the following startup idea IN DETAIL.

// Startup Idea:
// ${idea}

// Target Location:
// ${location}

// Budget Range:
// ${budget}

// Target Audience:
// ${audience}

// Provide a detailed feasibility analysis with clear reasoning.

// Respond ONLY in valid JSON in the following format:

// {
//   "problem": "...",
//   "existingSolutions": "...",
//   "marketGap": "...",
//   "feasibilityScore": {
//     "score": 1,
//     "justification": "..."
//   }
// }

// Important rules:
// - Return ONLY valid JSON
// - Do NOT summarize
// - Do NOT use bullet points
// - Be specific and analytical
// `;

//     const completion = await groq.chat.completions.create({
//       model: "llama-3.1-8b-instant",
      
//       messages: [{ role: "user", content: prompt }],
//       temperature: 0.25,
      
//     });

//     const aiResponse = completion.choices[0].message.content;

//    function safeJsonParse(text) {
//   const start = text.indexOf("{");
//   const end = text.lastIndexOf("}");

//   if (start === -1 || end === -1) {
//     throw new Error("No valid JSON found in AI response");
//   }

//   return JSON.parse(text.slice(start, end + 1));
// }
// const parsed = safeJsonParse(aiResponse);
// res.json(parsed);


//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Feasibility check failed" });
//   }
// };

import "dotenv/config";
import Groq from "groq-sdk";
import Startup from "../models/Startup.js";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

/* ---------------- SAFE JSON PARSER ---------------- */

function safeJsonParse(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error("No JSON found in AI response");
  }

  let jsonString = text.slice(start, end + 1);

  // ✅ remove control characters
  jsonString = jsonString.replace(/[\u0000-\u001F]+/g, " ");

  // ✅ fix smart quotes
  jsonString = jsonString
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'");

  // ✅ remove trailing commas
  jsonString = jsonString.replace(/,\s*}/g, "}");
  jsonString = jsonString.replace(/,\s*]/g, "]");

  return JSON.parse(jsonString);
}

/* ---------------- CONTROLLER ---------------- */

export const checkFeasibility = async (req, res) => {
  try {
    const { idea, location, budget, audience } = req.body;

    const prompt = `
You are a senior startup analyst with 10+ years of experience.

Analyze the following startup idea.

Startup Idea: ${idea}
Target Location: ${location}
Budget Range: ${budget}
Target Audience: ${audience}

IMPORTANT RULES:
- You MUST include the field "category"
- "category" MUST be EXACTLY one of:
  Food, Tech, Service, Retail, Manufacturing
- Do NOT invent new categories
- Do NOT leave category empty

Return ONLY valid JSON.
No markdown.
No explanations.
No line breaks inside strings.

JSON FORMAT (ALL FIELDS REQUIRED):

{
  "problem": "...",
  "existingSolutions": "...",
  "marketGap": "...",
  "category": "Food | Tech | Service | Retail | Manufacturing",
  "feasibilityScore": {
    "score": number,
    "justification": "..."
  }
}


`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.25
    });

    const aiResponse = completion.choices[0].message.content;

    // ✅ DEBUG (remove later if you want)
    console.log("AI RAW RESPONSE:\n", aiResponse);

    const parsed = safeJsonParse(aiResponse);

    /* -------- Normalize score -------- */

    const score = Number(parsed.feasibilityScore?.score) || 0;

    /* -------- Save startup -------- */
const allowedCategories = [
  "Food",
  "Tech",
  "Service",
  "Retail",
  "Manufacturing"
];

let category = parsed.category;

// normalize
if (typeof category === "string") {
  category = category.replace(/\s+/g, " ").trim();
}

// validate
if (!allowedCategories.includes(category)) {
  console.warn("Invalid category from AI:", parsed.category);
  category = "Service";
}

console.log("AI category raw:", JSON.stringify(parsed.category));
console.log("Final category saved:", category);



    const startup = new Startup({
      idea,
      location,
      budget,
      audience,
      
      feasibility: {
        category,

        score,
        justification: parsed.feasibilityScore?.justification || "",
        problem: parsed.problem || "",
        existingSolutions: parsed.existingSolutions || "",
        marketGap: parsed.marketGap || ""
      },

      status: score >= 7 ? "promising" : "draft"
    });

    await startup.save();

    /* -------- Response -------- */

    res.json({
      startupId: startup._id,
      feasibility: startup.feasibility,
      status: startup.status
    });

  } catch (error) {
    console.error("Feasibility error:", error);
    res.status(500).json({
      message: "Feasibility check failed"
    });
  }
};
