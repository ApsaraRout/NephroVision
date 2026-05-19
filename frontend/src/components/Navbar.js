// src/components/Navbar.jsx
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { HiMenu, HiOutlineX } from "react-icons/hi";
import { useAuth } from "../AuthContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth(); // ✅ IMPORTANT

  const links = [
    { to: "/", label: "RenoSnap" },
    { to: "/predict", label: "Risk Horizon" },
    { to: "/nephrolife", label: "NephroLife" },
    { to: "/recommendations", label: "RenalGuard" },
    { to: "/renalradar", label: "RenalRadar" },
    { to: "/chatbot", label: "NephroAI" },
    { to: "/egfr-calculator", label: "eGFR Calculator" },
  ];

  return (
    <header className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[92%] max-w-6xl z-50">
      <nav className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl px-4 md:px-6 py-3 flex items-center justify-between">

        {/* LEFT: Navigation Links (Desktop) */}
        <div className="hidden md:flex items-center space-x-6">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-3 py-1 rounded-md font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-white/20 text-white shadow-inner"
                    : "text-white/80 hover:bg-white/5 hover:text-white"
                }`
              }
              onClick={() => setOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">

          {/* ✅ AUTH BUTTONS */}
          {!isAuthenticated ? (
            <>
              <NavLink
                to="/login"
                className="hidden md:inline-block px-4 py-2 rounded-full bg-white/20 text-white font-medium hover:bg-white/30 transition"
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                className="hidden md:inline-block px-4 py-2 rounded-full bg-cyan-500 text-white font-medium hover:bg-cyan-400 transition"
              >
                Register
              </NavLink>
            </>
          ) : (
            <button
              onClick={logout}
              className="hidden md:inline-block px-4 py-2 rounded-full bg-red-500 text-white font-medium hover:bg-red-400 transition"
            >
              Logout
            </button>
          )}

          {/* CTA */}
          <NavLink
            to="/predict"
            className="hidden md:inline-block px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-red-500 text-white font-semibold shadow-lg hover:scale-[1.03] transition"
          >
            Start Prediction
          </NavLink>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 rounded-md bg-white/10 hover:bg-white/20 transition"
            onClick={() => setOpen((s) => !s)}
          >
            {open ? (
              <HiOutlineX className="w-6 h-6 text-white" />
            ) : (
              <HiMenu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>

        {/* MOBILE MENU */}
        <div
          className={`md:hidden absolute left-4 right-4 top-full mt-3 rounded-xl border border-white/20 bg-white/10 backdrop-blur-xl py-4 px-4 shadow-2xl transition-all duration-300 ${
            open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <div className="flex flex-col gap-3">

            {/* Links */}
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md font-medium ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "text-white/90 hover:bg-white/10"
                  }`
                }
                onClick={() => setOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}

            {/* ✅ AUTH MOBILE */}
            {!isAuthenticated ? (
              <>
                <NavLink
                  to="/login"
                  className="block px-3 py-2 text-white"
                  onClick={() => setOpen(false)}
                >
                  Login
                </NavLink>

                <NavLink
                  to="/register"
                  className="block px-3 py-2 text-white"
                  onClick={() => setOpen(false)}
                >
                  Register
                </NavLink>
              </>
            ) : (
              <button
                onClick={logout}
                className="block px-3 py-2 text-red-400"
              >
                Logout
              </button>
            )}

            {/* CTA */}
            <NavLink
              to="/predict"
              className="mt-2 text-center px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-red-500 text-white font-semibold shadow-lg"
              onClick={() => setOpen(false)}
            >
              Start Prediction
            </NavLink>
          </div>
        </div>

      </nav>
    </header>
  );
}