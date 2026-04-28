import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar'; // Assure-toi que le chemin vers ton fichier Sidebar est correct
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  DollarSign, 
  Users as UsersIcon,
  TrendingUp
} from 'lucide-react';




const Dashboard = () => {
  // Ces données statiques seront remplacées par tes appels API Spring Boot
  // pour calculer la recette totale (somme des frais d'envoi et retrait) 

  const [recette, setRecette] = useState(0);
  
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchRecette = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/retrait/recette`, { headers });
      setRecette(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRecette();
  }, []);

  const stats = [
    {
      title: "Recette Opérateur",
      value: `${Number(recette).toLocaleString('de-DE')} Ar`,
      detail: "Frais d'envoi + retrait",
      icon: <DollarSign className="text-blue-500" />,
      trend: "+12.5%",
      trendColor: "text-green-400"
    },
    {
      title: "Volume Envois",
      value: "1.250.000 Ar",
      detail: "Total des transactions",
      icon: <ArrowUpRight className="text-purple-500" />,
      trend: "En hausse",
      trendColor: "text-slate-400"
    },
    {
      title: "Nouveaux Clients",
      value: "24",
      detail: "Inscriptions du mois",
      icon: <UsersIcon className="text-emerald-500" />,
      trend: "+4",
      trendColor: "text-green-400"
    }
  ];

  return (
    <div className="flex bg-[#0f172a] min-h-screen font-sans">
      {/* Appel du composant Sidebar tel que tu l'as défini */}
      <Sidebar />

      {/* Contenu Principal décalé pour ne pas être caché par la Sidebar fixed */}
      <main className="ml-64 flex-1 p-8 text-slate-200">
        
        {/* Header avec informations utilisateur */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Tableau de Bord</h1>
            <p className="text-slate-400 mt-1">Analyse globale de l'activité M-Money Pro</p>
          </div>
          
          <div className="flex items-center gap-4 bg-[#1e293b] p-2 pr-6 rounded-full border border-slate-700 shadow-lg">
             <div className="w-10 h-10 bg-linear-to-tr from-blue-600 to-indigo-500 rounded-full flex items-center justify-center font-bold text-white">
               A
             </div>
             <div className="flex flex-col">
               <span className="text-sm font-semibold text-white">Administrateur</span>
               <span className="text-[10px] text-slate-500 uppercase tracking-wider">Session Active</span>
             </div>
          </div>
        </header>

        {/* Grille des statistiques (Calcul de recette demandé point 16) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, index) => (
            <div key={index} className="bg-[#1e293b] p-6 rounded-3xl border border-slate-700 hover:border-blue-500/50 transition-all duration-300 shadow-sm group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-slate-800 rounded-2xl group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-lg bg-slate-800 ${stat.trendColor}`}>
                  {stat.trend}
                </span>
              </div>
              <p className="text-slate-400 text-sm font-medium">{stat.title}</p>
              <h3 className="text-3xl font-bold text-white mt-1">{stat.value}</h3>
              <p className="text-[10px] text-slate-500 mt-2 italic">{stat.detail}</p>
            </div>
          ))}
        </div>

        {/* Section d'affichage des graphiques ou des activités récentes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#1e293b] p-8 rounded-3xl border border-slate-700 min-h-[300px] flex flex-col justify-center items-center">
            <TrendingUp size={48} className="text-slate-700 mb-4" />
            <p className="text-slate-500 font-medium">Graphique des flux financiers mensuels</p>
            <span className="text-xs text-slate-600 italic mt-2">(Intégration Chart.js ou Recharts ici)</span>
          </div>

          <div className="bg-[#1e293b] p-8 rounded-3xl border border-slate-700 min-h-[300px]">
            <h4 className="text-white font-bold mb-6 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              Activités récentes
            </h4>
            <div className="space-y-6">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex gap-4 border-l-2 border-slate-800 pl-4 py-1">
                  <div className="flex flex-col">
                    <span className="text-xs text-blue-400 font-semibold italic">Il y a 5 min</span>
                    <span className="text-sm text-slate-300">Envoi de 50.000 Ar vers 032...</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Dashboard;