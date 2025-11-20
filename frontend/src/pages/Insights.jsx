import React, { useEffect, useState } from "react";
import { api } from "../api";

export default function Insights() {
  const [groups, setGroups] = useState([]);
  const [groupId, setGroupId] = useState("");
  const [stats, setStats] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const g = await api("/api/groups");
        setGroups(g);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  async function loadInsights() {
    if (!groupId) return;
    setLoading(true);
    try {
      const data = await api(`/api/ai/monthly-insights/${groupId}`);
      setStats(data.stats);
      setSummary(data.summary);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>AI Monthly Insights</h2>
      <div>
        <select
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
          style={{ marginRight: 10 }}
        >
          <option value="">Select group</option>
          {groups.map((g) => (
            <option key={g._id} value={g._id}>
              {g.name}
            </option>
          ))}
        </select>
        <button onClick={loadInsights} disabled={loading || !groupId}>
          {loading ? "Loading..." : "Get Insights"}
        </button>
      </div>

      {stats && (
        <div style={{ marginTop: 20 }}>
          <h3>Stats</h3>
          <p>Total spent: ₹{stats.total}</p>
          <p>Transactions: {stats.count}</p>
          <h4>By category:</h4>
          <ul>
            {Object.entries(stats.byCategory).map(([cat, val]) => (
              <li key={cat}>
                {cat}: ₹{val}
              </li>
            ))}
          </ul>
        </div>
      )}

      {summary && (
        <div style={{ marginTop: 20, whiteSpace: "pre-wrap" }}>
          <h3>AI Summary</h3>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}
