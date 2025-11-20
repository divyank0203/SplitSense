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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
          Your Groups
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-[2fr,3fr]">
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4">
          <h3 className="text-sm font-medium text-slate-800 dark:text-slate-100 mb-3">
            Create new group
          </h3>
          <form onSubmit={create} className="space-y-3">
            <input
              className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
              placeholder="e.g. Goa Trip, Flat 401, Fresher's Party"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button
              className="w-full rounded-md bg-slate-900 text-slate-50 py-2 text-sm font-medium hover:bg-slate-800 transition-colors"
            >
              Create
            </button>
          </form>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4">
          <h3 className="text-sm font-medium text-slate-800 dark:text-slate-100 mb-3">
            Existing groups
          </h3>
          {groups.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No groups yet. Create one to get started.
            </p>
          ) : (
            <ul className="space-y-2">
              {groups.map((g) => (
                <li key={g._id}>
                  <Link
                    to={`/group/${g._id}`}
                    className="flex items-center justify-between rounded-md px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <span className="font-medium text-slate-800 dark:text-slate-100">
                      {g.name}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {g.members?.length || 1} member
                      {(g.members?.length || 1) > 1 && "s"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
