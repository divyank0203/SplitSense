const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export async function api(path, method = "GET", body = null) {
  const token = localStorage.getItem("ss_token");
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "API error");
  return data;
}
