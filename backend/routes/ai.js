import express from "express";
import auth from "../middleware/auth.js";
import Expense from "../models/Expense.js";
import Group from "../models/Group.js";
import {
  parseNaturalLanguageExpenses,
  generateInsightsSummary,
  explainSettlements
} from "../services/aiClient.js";

const router = express.Router();

// POST /api/ai/parse-expenses-text
router.post("/parse-expenses-text", auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Text required" });
    const parsed = await parseNaturalLanguageExpenses(text);
    res.json({ expenses: parsed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "AI parsing failed" });
  }
});

// GET /api/ai/monthly-insights/:groupId
router.get("/monthly-insights/:groupId", auth, async (req, res) => {
  try {
    const { groupId } = req.params;
    const now = new Date();
    const monthAgo = new Date();
    monthAgo.setMonth(now.getMonth() - 1);

    const expenses = await Expense.find({
      groupId,
      createdAt: { $gte: monthAgo, $lte: now }
    }).lean();

    const stats = {
      total: expenses.reduce((s, e) => s + e.amount, 0),
      byCategory: {},
      count: expenses.length
    };
    for (const e of expenses) {
      const cat = e.category || "other";
      stats.byCategory[cat] = (stats.byCategory[cat] || 0) + e.amount;
    }

    const summary = await generateInsightsSummary(stats);
    res.json({ stats, summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "AI insights failed" });
  }
});

// POST /api/ai/explain-settlements
router.post("/explain-settlements", auth, async (req, res) => {
  try {
    const { transfers, users } = req.body; // users: { userId: name }
    if (!transfers || !users)
      return res.status(400).json({ message: "Missing data" });
    const explanation = await explainSettlements(transfers, users);
    res.json({ explanation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "AI explanation failed" });
  }
});

export default router;
