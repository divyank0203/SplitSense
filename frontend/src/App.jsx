import React, {
  useState,
  createContext,
  useContext,
  useEffect,
} from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Groups from "./pages/Groups.jsx";
import GroupView from "./pages/Groupview.jsx";
import Insights from "./pages/Insights.jsx";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";


export const AuthContext = createContext(null);

function Layout({ children, theme, toggleTheme }) {
  const { token, setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("ss_token");
    setToken(null);
    navigate("/login");
  };

  return (
    // Stronger light background with subtle gradient
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Dark, solid navbar in both themes */}
      <nav className="border-b border-slate-800/60 bg-slate-900 text-slate-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="text-xl font-semibold tracking-tight hover:text-slate-800 hover:bg-slate-50 px-2 py-1 rounded-md transition-colors cursor-default hover:shadow-md hover:cursor-pointer">
              SettleFlow
            </span>
            {token && (
              <div className="flex items-center gap-4 text-sm">
                <Link
                  to="/"
                  className="text-slate-200 hover:text-white transition-colors hover:bg-slate-600 px-2 py-1 rounded-md transition-colors cursor-default hover:shadow-md hover:cursor-pointer"
                >
                  Groups
                </Link>
                <Link
                  to="/insights"
                  className="text-slate-200 hover:text-white transition-colors hover:bg-slate-600 px-2 py-1 rounded-md transition-colors cursor-default hover:shadow-md hover:cursor-pointer"
                >
                  Insights
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 text-sm">
            {/* Theme toggle top right */}
            <button
              onClick={toggleTheme}
              className="h-8 w-8 flex items-center justify-center rounded-full border border-slate-500 bg-slate-900 hover:bg-slate-500 transition-colors text-lg "
              title={
                theme === "light"
                  ? "Switch to dark mode"
                  : "Switch to light mode"
              }
            >
              {theme === "light" ? (
  <MoonIcon className="h-5 w-5 text-slate-700" />
) : (
  <SunIcon className="h-5 w-5 text-yellow-400" />
)}

            </button>

            {token ? (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-md bg-indigo-500 text-slate-50 hover:bg-indigo-600 transition-colors text-xs font-medium"
              >
                Logout
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-md border border-slate-500 text-slate-50 hover:bg-slate-800 transition-colors text-xs"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 rounded-md bg-indigo-500 text-slate-50 hover:bg-indigo-600 transition-colors text-xs font-medium"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-6">{children}</div>
      </main>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { token } = useContext(AuthContext);
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("ss_token"));

  // theme: "light" or "dark"
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem("sf_theme");
    if (stored === "light" || stored === "dark") return stored;
    return "light";
  });

  useEffect(() => {
    localStorage.setItem("sf_theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {/* This wrapper controls dark mode */}
      <div className={theme === "dark" ? "dark" : ""}>
        <BrowserRouter>
          <Layout theme={theme} toggleTheme={toggleTheme}>
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Groups />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/group/:id"
                element={
                  <ProtectedRoute>
                    <GroupView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/insights"
                element={
                  <ProtectedRoute>
                    <Insights />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </div>
    </AuthContext.Provider>
  );
}
