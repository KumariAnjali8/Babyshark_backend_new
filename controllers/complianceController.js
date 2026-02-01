import Startup from "../models/Startup.js";
import License from "../models/License.js";
import StartupCompliance from "../models/StartupCompliance.js";

/* GET applicable licenses */
export const getLicenses = async (req, res) => {
  try {
    const { startupId } = req.params;

    const startup = await Startup.findById(startupId);
    if (!startup) {
      return res.status(404).json({ message: "Startup not found" });
    }

    console.log("Startup feasibility:", startup.feasibility);

    // ✅ DEFINE CATEGORY FIRST
    const category = startup.feasibility?.category;

    console.log("Startup category:", category);

    if (!category) {
      return res.json([]);
    }

    const licenses = await License.find({
      appliesTo: { $in: [category] }
    });

    console.log("Licenses found:", licenses.length);

    const existing = await StartupCompliance.find({ startupId });
    if (existing.length === 0) {
      await StartupCompliance.insertMany(
        licenses.map(l => ({
          startupId,
          licenseId: l._id
        }))
      );
    }

    res.json(licenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch licenses" });
  }
};


/* GET dashboard statuses */
export const getComplianceDashboard = async (req, res) => {
  try {
    const { startupId } = req.params;

    const data = await StartupCompliance.find({ startupId })
      .populate("licenseId");

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Dashboard fetch failed" });
  }
};

/* UPDATE license status */
export const updateComplianceStatus = async (req, res) => {
  try {
    const { startupId, licenseId } = req.params;
    const { status } = req.body;

    await StartupCompliance.findOneAndUpdate(
      { startupId, licenseId },
      { status },
      { upsert: true }
    );

    const total = await StartupCompliance.countDocuments({ startupId });
    const approved = await StartupCompliance.countDocuments({
      startupId,
      status: "Approved"
    });

    const progress = total
      ? Math.round((approved / total) * 100)
      : 0;

    res.json({
      progress,
      collaborationUnlocked: progress >= 70
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
};
