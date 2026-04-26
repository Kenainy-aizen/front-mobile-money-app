import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Send, Wallet, Settings, FileText, LogOut } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20}/>, path: '/dashboard' },
    { name: 'Clients', icon: <Users size={20}/>, path: '/clients' },
    { name: 'Envois', icon: <Send size={20}/>, path: '/operations/envoi' },
    { name: 'Retraits', icon: <Wallet size={20}/>, path: '/operations/retrait' },
    { name: 'Frais Envoi', icon: <Settings size={20}/>, path: '/frais/envoi' },
    { name: 'Frais Retrait', icon: <Settings size={20}/>, path: '/frais/retrait' },
    { name: 'Relevé PDF', icon: <FileText size={20}/>, path: '/releve' },
  ];

  return (
    <div className="h-screen w-64 bg-[#1e293b] text-slate-300 flex flex-col shadow-xl fixed">
      <div className="p-6 text-white font-bold text-xl border-b border-slate-700 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg text-white"><Wallet size={20}/></div>
        M-Money Pro
      </div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-4 p-3 rounded-xl transition-all ${
                isActive ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            {item.icon}
            <span className="font-medium text-sm">{item.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-700">
        <button onClick={() => {localStorage.clear(); window.location.reload();}} className="flex items-center gap-4 p-3 w-full text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
          <LogOut size={20} />
          <span className="font-medium text-sm">Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;