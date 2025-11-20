import express from "express";
import Group from "../models/Group.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const { name, members } = req.body;
    if (!name) return res.status(400).json({ message: "Name required" });
    const group = await Group.create({
      name,
      members: members && members.length ? members : [req.user.id]
    });
    res.json(group);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user.id }).populate(
      "members",
      "name email"
    );
    res.json(groups);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
