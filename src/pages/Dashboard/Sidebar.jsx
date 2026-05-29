import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Send,
  Wallet,
  Settings,
  FileText,
  LogOut,
  Option,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext.jsx";

const Sidebar = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/dashboard",
    },
    { name: "Clients", icon: <Users size={20} />, path: "/clients" },
    { name: "Envois", icon: <Send size={20} />, path: "/envois" },
    { name: "Retraits", icon: <Wallet size={20} />, path: "/retrait" },
    { name: "Frais Envoi", icon: <Settings size={20} />, path: "/fraisenvoi" },
    {
      name: "Frais Retrait",
      icon: <Settings size={20} />,
      path: "/fraisretrait",
    },
    { name: "Relevé PDF", icon: <FileText size={20} />, path: "/releve" },
    { name: "Options", icon: <Option size={20} />, path: "/option" },
  ];

  return (
    <div className="h-screen w-64 bg-sidebar text-primary flex flex-col shadow-card fixed z-40">
      {/* Logo / Brand */}
      <div className="pt-5 pb-4 px-4 border-b border-card flex items-center gap-3 min-h-[68px]">
        <img src="/logo.svg" alt="M-Money Pro" className="h-9 w-auto" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 p-3 rounded-xl transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg"
                  : "hover:bg-hover hover:text-heading"
              }`
            }
          >
            {item.icon}
            <span className="font-medium text-sm">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="p-4 border-t border-card space-y-2">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-4 p-3 w-full rounded-xl transition-all hover:bg-hover hover:text-heading group"
        >
          {theme === "dark" ? (
            <Sun
              size={20}
              className="text-amber-400 group-hover:text-amber-300 transition-colors"
            />
          ) : (
            <Moon
              size={20}
              className="text-indigo-500 group-hover:text-indigo-400 transition-colors"
            />
          )}
          <span className="font-medium text-sm">
            {theme === "dark" ? "Mode clair" : "Mode sombre"}
          </span>
        </button>

        {/* Logout */}
        <button
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
          className="flex items-center gap-4 p-3 w-full text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium text-sm">Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
