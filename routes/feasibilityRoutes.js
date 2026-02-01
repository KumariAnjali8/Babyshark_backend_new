
// import express from "express";
// import { getWeather } from "../controllers/weatherController.js";

// const router = express.Router();

// router.get("/weather", getWeather);

// export default router;
import express from "express";
import { checkFeasibility } from "../controllers/feasibilityController.js";

const router = express.Router();

router.post("/feasibility", checkFeasibility);

export default router;
