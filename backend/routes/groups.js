import express from "express";
import Group from "../models/Group.js";
import User from "../models/User.js";
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

// PATCH /api/groups/:id/add-member
router.patch("/:id/add-member", auth, async (req, res) => {
  try {
    const { email } = req.body;
    const { id } = req.params;

    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const group = await Group.findById(id);
    if (!group) return res.status(404).json({ message: "Group not found" });

    // ensure only members can modify group
    if (!group.members.map(String).includes(req.user.id)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // add user if not already in members
    if (!group.members.map(String).includes(user._id.toString())) {
      group.members.push(user._id);
      await group.save();
    }

    const populated = await Group.findById(id).populate(
      "members",
      "name email"
    );

    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
