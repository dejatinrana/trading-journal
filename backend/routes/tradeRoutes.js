import express from "express";
import Trade from "../models/Trade.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

// Add new trade
router.post("/", async (req, res) => {
  try {
    const trade = await Trade.create({
      ...req.body,
      user: req.user._id,
    });

    res.status(201).json(trade);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create trade",
      error: error.message,
    });
  }
});

// Get all trades of logged-in user
router.get("/", async (req, res) => {
  try {
    const trades = await Trade.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(trades);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch trades",
      error: error.message,
    });
  }
});

// Get single trade of logged-in user
router.get("/:id", async (req, res) => {
  try {
    const trade = await Trade.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!trade) {
      return res.status(404).json({ message: "Trade not found" });
    }

    res.status(200).json(trade);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch trade",
      error: error.message,
    });
  }
});

// Update trade of logged-in user
router.put("/:id", async (req, res) => {
  try {
    const trade = await Trade.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!trade) {
      return res.status(404).json({ message: "Trade not found" });
    }

    res.status(200).json(trade);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update trade",
      error: error.message,
    });
  }
});

// Delete trade of logged-in user
router.delete("/:id", async (req, res) => {
  try {
    const trade = await Trade.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!trade) {
      return res.status(404).json({ message: "Trade not found" });
    }

    res.status(200).json({ message: "Trade deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete trade",
      error: error.message,
    });
  }
});

export default router;