import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api";
import { AuthContext } from "../App.jsx";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();
  const { setToken } = useContext(AuthContext);

  async function submit(e) {
    e.preventDefault();
    try {
      const data = await api("/api/auth/register", "POST", {
        name,
        email,
        password,
      });
      localStorage.setItem("ss_token", data.token);
      setToken(data.token);
      nav("/");
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
          Create account
        </h2>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">
              Name
            </label>
            <input
              className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">
              Email
            </label>
            <input
              className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">
              Password
            </label>
            <input
              className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            className="w-full rounded-md bg-slate-900 text-slate-50 py-2 text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            Register
          </button>
        </form>
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="text-slate-900 dark:text-slate-100 underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
