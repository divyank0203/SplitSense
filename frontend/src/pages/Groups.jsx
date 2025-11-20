import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await api("/api/groups");
        setGroups(data);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  async function create(e) {
    e.preventDefault();
    try {
      const g = await api("/api/groups", "POST", { name });
      setGroups((prev) => [...prev, g]);
      setName("");
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div>
      <h2>Your Groups</h2>
      <form onSubmit={create}>
        <input
          placeholder="New group name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button>Create</button>
      </form>
      <ul>
        {groups.map((g) => (
          <li key={g._id}>
            <Link to={`/group/${g._id}`}>{g.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
