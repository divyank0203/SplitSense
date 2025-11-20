import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";

export default function GroupView() {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [payer, setPayer] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [settlements, setSettlements] = useState([]);
  const [settleExplanation, setSettleExplanation] = useState("");
  const [nlText, setNlText] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");


  useEffect(() => {
    async function load() {
      try {
        const groups = await api("/api/groups");
        const g = groups.find((x) => x._id === id);
        setGroup(g);
        setMembers(g?.members || []);
        const ex = await api(`/api/expenses/group/${id}`);
        setExpenses(ex);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, [id]);

  async function addExpense(e) {
    e.preventDefault();
    try {
      const share = Number(amount) / members.length;
      const splits = members.map((m) => ({ user: m._id, share }));
      await api("/api/expenses", "POST", {
        groupId: id,
        payer,
        amount: Number(amount),
        splits,
        description
      });
      const ex = await api(`/api/expenses/group/${id}`);
      setExpenses(ex);
      setAmount("");
      setDescription("");
    } catch (err) {
      alert(err.message);
    }
  }

  async function addMember(e) {
  e.preventDefault();
  try {
    const updatedGroup = await api(`/api/groups/${id}/add-member`, "PATCH", {
      email: newMemberEmail,
    });
    setGroup(updatedGroup);
    setMembers(updatedGroup.members || []);
    setNewMemberEmail("");
  } catch (err) {
    alert(err.message);
  }
}


  async function loadSettlements() {
    try {
      const res = await api(`/api/expenses/settlements/${id}`);
      setSettlements(res.transfers || []);
      if (res.transfers?.length) {
        const usersMap = {};
        for (const m of members) usersMap[m._id] = m.name;
        const exp = await api("/api/ai/explain-settlements", "POST", {
          transfers: res.transfers,
          users: usersMap
        });
        setSettleExplanation(exp.explanation);
      } else {
        setSettleExplanation("No settlements needed.");
      }
    } catch (err) {
      alert(err.message);
    }
  }

async function deleteExpense(id) {
  try {
    await api(`/api/expenses/${id}`, "DELETE");
    setExpenses((prev) => prev.filter((e) => e._id !== id));
  } catch (err) {
    alert(err.message);
  }
}


async function parseNL() {
  setLoadingAI(true);
  try {
    const resp = await api("/api/ai/parse-expenses-text", "POST", {
      text: nlText,
    });
    const parsed = resp.expenses || [];

    if (!parsed.length) {
      alert("AI could not parse any expenses.");
      return;
    }

    // map payerName => member._id (case-insensitive)
    const nameToId = {};
    members.forEach((m) => {
      nameToId[m.name.toLowerCase()] = m._id;
    });

    let createdCount = 0;

    for (const exp of parsed) {
      const payerId = nameToId[exp.payerName.toLowerCase()];
      if (!payerId) {
        console.warn("No member match for payerName:", exp.payerName);
        continue;
      }

      const amount = Number(exp.amount);
      if (!amount || isNaN(amount)) continue;

      const share = amount / members.length;
      const splits = members.map((m) => ({ user: m._id, share }));

      await api("/api/expenses", "POST", {
        groupId: id,
        payer: payerId,
        amount,
        splits,
        description: exp.description || "AI parsed expense",
      });

      createdCount++;
    }

    if (createdCount === 0) {
      alert("AI parsed text but could not match any payers to group members.");
    } else {
      alert(`AI created ${createdCount} expenses.`);
      const ex = await api(`/api/expenses/group/${id}`);
      setExpenses(ex);
      setNlText("");
    }
  } catch (err) {
    alert(err.message);
  } finally {
    setLoadingAI(false);
  }
}


  return (
    <div>
      <h2>Group: {group?.name}</h2>

      <section style={{ marginBottom: 20 }}>
  <h3>Add Member (by email)</h3>
  <form onSubmit={addMember}>
    <input
      placeholder="Friend's email (they must be registered)"
      value={newMemberEmail}
      onChange={(e) => setNewMemberEmail(e.target.value)}
      style={{ marginRight: 8 }}
    />
    <button type="submit">Add Member</button>
  </form>
</section>


      <section style={{ marginBottom: 20 }}>
        <h3>Add Expense</h3>
        <form onSubmit={addExpense}>
          <div>
            <label>Payer: </label>
            <select
              value={payer}
              onChange={(e) => setPayer(e.target.value)}
              required
            >
              <option value="">Select</option>
              {members.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <input
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              placeholder="Description (AI will categorize)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <button>Add Expense</button>
        </form>
      </section>

      <section style={{ marginBottom: 20 }}>
        <h3>AI: Parse natural language expenses</h3>
        <textarea
          rows={4}
          style={{ width: "100%", maxWidth: 600 }}
          placeholder='Example: "We went to Manali, I paid 3000 for hotel, Rohit paid 1200 for dinner..."'
          value={nlText}
          onChange={(e) => setNlText(e.target.value)}
        />
        <br />
        <button onClick={parseNL} disabled={loadingAI}>
          {loadingAI ? "Asking AI..." : "Parse with AI"}
        </button>
      </section>

      <section style={{ marginBottom: 20 }}>
        <h3>Expenses</h3>
        <ul>
  {expenses.map((ex) => (
    <li key={ex._id}>
      {ex.description || "expense"} — ₹{ex.amount} by{" "}
      {ex.payer?.name || "Unknown"} [{ex.category}]{" "}
      <button
        onClick={() => deleteExpense(ex._id)}
        style={{ marginLeft: 8 }}
      >
        Delete
      </button>
    </li>
  ))}
</ul>

      </section>

      <section>
        <h3>Settlements</h3>
        <button onClick={loadSettlements}>Compute Settlements</button>
        <ul>
          {settlements.map((t, idx) => {
            const from = members.find((m) => m._id === t.from);
            const to = members.find((m) => m._id === t.to);
            return (
              <li key={idx}>
                {from?.name} pays {to?.name} ₹{t.amount}
              </li>
            );
          })}
        </ul>
        {settleExplanation && (
          <div style={{ marginTop: 10, whiteSpace: "pre-wrap" }}>
            <strong>AI Explanation:</strong>
            <br />
            {settleExplanation}
          </div>
        )}
      </section>
    </div>
  );
}
