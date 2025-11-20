// services/aiClient.js
// "AI-lite" implementation without external API, so everything works reliably.

// 1) Categorize expense based on description keywords
export async function categorizeExpense(description = "") {
  const d = description.toLowerCase();

  if (d.match(/pizza|food|biriyani|lunch|dinner|swiggy|zomato|restaurant/)) {
    return "food";
  }
  if (d.match(/uber|ola|bus|train|flight|cab|taxi|auto/)) {
    return "travel";
  }
  if (d.match(/rent|room|pg|hostel/)) {
    return "rent";
  }
  if (d.match(/electricity|wifi|internet|water|gas|bill/)) {
    return "utilities";
  }
  if (d.match(/shopping|amazon|flipkart|clothes|shoes|mall/)) {
    return "shopping";
  }
  if (d.match(/movie|netflix|prime|party|club/)) {
    return "entertainment";
  }
  if (d.match(/college|fees|books|stationery|exam/)) {
    return "college";
  }

  return "other";
}

// 2) Parse natural-language text into expenses using regex
// Example text:
// "I paid 1200 for hotel, Rohit paid 600 for dinner, Aman paid 300 for snacks"
export async function parseNaturalLanguageExpenses(text = "") {
  const out = [];
  const pattern = /(\w+)\s+paid\s+(\d+(?:\.\d+)?)\s+(?:for\s+)?([^.,]+)/gi;
  let match;
  while ((match = pattern.exec(text)) !== null) {
    const payerName = match[1];
    const amount = parseFloat(match[2]);
    const description = match[3].trim();
    if (!isNaN(amount)) {
      out.push({ payerName, amount, description });
    }
  }
  return out;
}

// 3) Generate a simple insights summary text from stats
export async function generateInsightsSummary(stats) {
  const lines = [];
  const total = stats.total || 0;
  const count = stats.count || 0;
  const byCategory = stats.byCategory || {};

  lines.push(`Total spent this month: ₹${total.toFixed(2)} across ${count} expenses.`);

  const entries = Object.entries(byCategory);
  if (entries.length) {
    entries.sort((a, b) => b[1] - a[1]);
    const [topCat, topVal] = entries[0];
    lines.push(`Highest spending category: ${topCat} (₹${topVal.toFixed(2)}).`);

    if (entries.length > 1) {
      const [secondCat, secondVal] = entries[1];
      lines.push(
        `Second highest category: ${secondCat} (₹${secondVal.toFixed(2)}).`
      );
    }
  } else {
    lines.push("No category breakdown available yet. Add more detailed descriptions.");
  }

  if (total > 0) {
    lines.push(
      "Try setting a simple budget target for your top category and track it weekly."
    );
  }

  return lines.join(" ");
}

// 4) Explain settlements in plain language
export async function explainSettlements(transfers, usersMap) {
  if (!transfers || !transfers.length) {
    return "No settlements needed. Everyone is already balanced.";
  }

  const lines = [];
  lines.push(
    "These transfers settle all balances with a minimal number of payments between group members:"
  );

  transfers.forEach((t) => {
    const fromName = usersMap[t.from] || "Someone";
    const toName = usersMap[t.to] || "Someone";
    lines.push(`${fromName} pays ${toName} ₹${t.amount.toFixed(2)}.`);
  });

  lines.push(
    "This pattern minimizes the number of transactions by directly matching people who owe money with those who should receive it."
  );

  return lines.join("\n");
}
