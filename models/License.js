import mongoose from "mongoose";

const licenseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  appliesTo: { type: [String], required: true }, // ["Food", "Tech"]
  mandatory: { type: Boolean, default: true },
  officialLink: String,
  description: String
});

export default mongoose.model("License", licenseSchema);
