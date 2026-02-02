// import express from "express";
// import weatherRoutes from "./routes/weatherRoutes.js";

// const app = express();

// app.use("/api", weatherRoutes);

// app.listen(5000, () => console.log("Server running on 5000"));
import "./config/env.js";

import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from"./db.js"
import feasibilityRoutes from "./routes/feasibilityRoutes.js";
import pitchRoutes from "./routes/pitchRoutes.js"
import roadmapRoutes from "./routes/roadmapRoutes.js"
import complianceRoutes from "./routes/complianceRoutes.js";
const app = express();

// ----- MIDDLEWARE -----
app.use(cors());                 // allow frontend requests
app.use(express.json());         // parse JSON bodies

///------DB CONNECTION------
connectDB();
// ----- ROUTES -----
app.use("/api", feasibilityRoutes);
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/pitch", pitchRoutes);


app.use("/api/compliance", complianceRoutes);

// ----- HEALTH CHECK (optional but recommended) -----
app.get("/", (req, res) => {
  res.send("API is running");
});

// ----- SERVER START -----
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
