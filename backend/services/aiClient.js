import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Helper: call chat model
async function chat(messages, { maxTokens = 128 } = {}) {
  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages,
    max_tokens: maxTokens,
    temperature: 0.2
  });
  return response.choices[0].message.content.trim();
}

// 1) Categorize expense
export async function categorizeExpense(description) {
  const prompt = `
You are an expense classifier. 
Categories: ["food", "travel", "rent", "utilities", "shopping", "entertainment", "college", "other"].
Return ONLY one category string.

Description: "${description}"
  `;
  const result = await chat([{ role: "user", content: prompt }]);
  return result.toLowerCase().replace(/[^a-z]/g, "") || "other";
}

// 2) Parse natural-language trip/group text → multiple expenses
export async function parseNaturalLanguageExpenses(text) {
  const prompt = `
You are an expense parser for a group trip.

Input is a free-form text where people mention who paid how much.
Return a JSON array of expenses. 
Each expense: { "payerName": string, "amount": number, "description": string }.
Do NOT include any extra text, ONLY valid JSON.

Text:
${text}
`;
  const result = await chat([{ role: "user", content: prompt }], {
    maxTokens: 400
  });

  try {
    return JSON.parse(result);
  } catch (e) {
    console.error("Failed to parse JSON from AI:", result);
    return [];
  }
}

// 3) Monthly insights summary
export async function generateInsightsSummary(stats) {
  const prompt = `
You are a financial assistant. 
User's monthly group expense stats (JSON) are:

${JSON.stringify(stats, null, 2)}

Write 3-5 short bullet points (plain text, no markdown) explaining:
- where they spent the most
- any spikes vs previous month
- one or two small suggestions.

Keep it under 120 words.
`;
  const result = await chat([{ role: "user", content: prompt }], {
    maxTokens: 220
  });
  return result;
}

// 4) Settlement explanation
export async function explainSettlements(transfers, usersMap) {
  const prompt = `
You are explaining settlement transfers for splitting group expenses.

Users:
${JSON.stringify(usersMap, null, 2)}

Transfers (fromId, toId, amount):
${JSON.stringify(transfers, null, 2)}

Explain in 3-4 short lines why these transfers are minimal and easy,
and list them in "X pays Y ₹amount" form. Plain text only.
`;
  const result = await chat([{ role: "user", content: prompt }], {
    maxTokens: 200
  });
  return result;
}
