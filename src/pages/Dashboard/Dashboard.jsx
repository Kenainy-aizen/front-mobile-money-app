import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import {
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  Users as UsersIcon,
  TrendingUp,
  Clock,
  Send,
  Wallet,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { fr } from "date-fns/locale";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const headers = useMemo(
    () => ({ Authorization: `Bearer ${token}` }),
    [token],
  );

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/dashboard/summary",
          { headers },
        );
        setData(response.data);
      } catch (err) {
        console.error("Erreur dashboard:", err);
        setError("Impossible de charger les données du tableau de bord.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [headers]);

  // Formater un nombre en Ar (ex: 1 250 000 Ar)
  const formatCurrency = (value) => {
    if (value == null) return "0 Ar";
    return `${Number(value).toLocaleString("de-DE")} Ar`;
  };

  // Formater un nombre simple
  const formatNumber = (value) => {
    if (value == null) return "0";
    return Number(value).toLocaleString("de-DE");
  };

  // Calculer le pourcentage d'évolution (simulé ici car on a pas d'historique)
  const getTrend = (value) => {
    if (!value || value === 0) return { text: "N/A", color: "text-slate-400" };
    return { text: "Actuel", color: "text-green-400" };
  };

  // Trouver la valeur max pour l'échelle du graphique
  const maxChartValue = useMemo(() => {
    if (!data?.donneesMensuelles) return 1;
    return Math.max(
      ...data.donneesMensuelles.map((d) =>
        Math.max(d.envoiTotal, d.retraitTotal),
      ),
      1,
    );
  }, [data]);

  // Noms des mois abrégés
  const MOIS = [
    "Jan",
    "Fév",
    "Mar",
    "Avr",
    "Mai",
    "Jun",
    "Jul",
    "Aoû",
    "Sep",
    "Oct",
    "Nov",
    "Déc",
  ];

  // Obtenir une couleur pour le type de transaction
  const getTypeColor = (type) => {
    return type === "ENVOI"
      ? "text-purple-400 border-purple-500"
      : "text-amber-400 border-amber-500";
  };

  const getTypeIcon = (type) => {
    return type === "ENVOI" ? (
      <Send size={14} className="text-purple-400" />
    ) : (
      <Wallet size={14} className="text-amber-400" />
    );
  };

  if (loading) {
    return (
      <div className="flex bg-main min-h-screen font-sans">
        <Sidebar />
        <main className="ml-64 flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-secondary font-medium">
              Chargement du tableau de bord...
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex bg-main min-h-screen font-sans">
        <Sidebar />
        <main className="ml-64 flex-1 p-8 flex items-center justify-center">
          <div className="bg-card p-8 rounded-3xl border border-red-500/30 text-center max-w-md">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp size={32} className="text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-heading mb-2">
              Erreur de connexion
            </h2>
            <p className="text-secondary text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all"
            >
              Réessayer
            </button>
          </div>
        </main>
      </div>
    );
  }

  const stats = [
    {
      title: "Recette Opérateur",
      value: formatCurrency(data?.recetteTotale),
      detail: "Frais d'envoi + retrait",
      icon: <DollarSign className="text-blue-500" />,
      trend: getTrend(data?.recetteTotale),
    },
    {
      title: "Volume Envois",
      value: formatCurrency(data?.volumeEnvoisTotal),
      detail: "Somme totale des envois",
      icon: <ArrowUpRight className="text-purple-500" />,
      trend: getTrend(data?.volumeEnvoisTotal),
    },
    {
      title: "Volume Retraits",
      value: formatCurrency(data?.volumeRetraitsTotal),
      detail: "Somme totale des retraits",
      icon: <ArrowDownLeft className="text-amber-500" />,
      trend: getTrend(data?.volumeRetraitsTotal),
    },
    {
      title: "Nombre de Clients",
      value: formatNumber(data?.nombreClients),
      detail: "Total des clients enregistrés",
      icon: <UsersIcon className="text-emerald-500" />,
      trend: { text: "Total", color: "text-secondary" },
    },
  ];

  return (
    <div className="flex bg-main min-h-screen font-sans">
      <Sidebar />

      <main className="ml-64 flex-1 p-8 text-primary">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-heading">
              Tableau de Bord
            </h1>
            <p className="text-secondary mt-1">
              Analyse globale de l'activité M-Money Pro
            </p>
          </div>

          <div className="flex items-center gap-4 bg-card p-2 pr-6 rounded-full border border-card shadow-card-lg">
            <div className="w-10 h-10 bg-linear-to-tr from-blue-600 to-indigo-500 rounded-full flex items-center justify-center font-bold text-white">
              A
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-heading">
                Administrateur
              </span>
              <span className="text-[10px] text-muted uppercase tracking-wider">
                Session Active
              </span>
            </div>
          </div>
        </header>

        {/* Grille des statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-card p-6 rounded-3xl border border-card hover:border-blue-500/50 transition-all duration-300 shadow-sm group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-element rounded-2xl group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-lg bg-element ${stat.trend.color}`}
                >
                  {stat.trend.text}
                </span>
              </div>
              <p className="text-secondary text-sm font-medium">{stat.title}</p>
              <h3 className="text-2xl font-bold text-heading mt-1 truncate">
                {stat.value}
              </h3>
              <p className="text-[10px] text-muted mt-2 italic">
                {stat.detail}
              </p>
            </div>
          ))}
        </div>

        {/* Graphique mensuel + Activités récentes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Graphique des flux mensuels */}
          <div className="lg:col-span-2 bg-card p-8 rounded-3xl border border-card">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-element rounded-xl">
                <TrendingUp size={20} className="text-blue-400" />
              </div>
              <div>
                <h3 className="text-heading font-bold">
                  Flux financiers mensuels
                </h3>
                <p className="text-xs text-muted">
                  {new Date().getFullYear()} — Évolution des envois et retraits
                </p>
              </div>
            </div>

            {data?.donneesMensuelles && data.donneesMensuelles.length > 0 ? (
              <div className="relative pt-6 pb-2">
                {/* Légende */}
                <div className="flex gap-6 mb-6 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-purple-500" />
                    <span className="text-secondary">Envois</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-amber-500" />
                    <span className="text-secondary">Retraits</span>
                  </div>
                </div>

                {/* Barres */}
                <div
                  className="flex justify-between gap-2"
                  style={{ height: "200px" }}
                >
                  {data.donneesMensuelles
                    .filter((d) => d.envoiTotal > 0 || d.retraitTotal > 0)
                    .map((d, i) => {
                      const barHeightEnvoi =
                        maxChartValue > 0
                          ? Math.max((d.envoiTotal / maxChartValue) * 160, 4)
                          : 4;
                      const barHeightRetrait =
                        maxChartValue > 0
                          ? Math.max((d.retraitTotal / maxChartValue) * 160, 4)
                          : 4;

                      return (
                        <div
                          key={d.month}
                          className="flex-1 flex flex-col justify-end items-center"
                        >
                          {/* Barres */}
                          <div className="flex flex-col items-center gap-0.5">
                            {/* Barre Envoi */}
                            <div
                              className="w-8 bg-purple-500/80 rounded-t-sm transition-all duration-300 hover:bg-purple-400 relative group"
                              style={{ height: `${barHeightEnvoi}px` }}
                            >
                              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg border border-card pointer-events-none">
                                {formatCurrency(d.envoiTotal)}
                              </div>
                            </div>
                            {/* Barre Retrait */}
                            <div
                              className="w-8 bg-amber-500/80 rounded-t-sm transition-all duration-300 hover:bg-amber-400 relative group"
                              style={{ height: `${barHeightRetrait}px` }}
                            >
                              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg border border-card pointer-events-none">
                                {formatCurrency(d.retraitTotal)}
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] text-muted font-medium mt-1 mb-1">
                            {MOIS[d.month - 1]}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-muted">
                <TrendingUp size={40} className="mb-3 opacity-50" />
                <p className="text-sm font-medium">
                  Aucune donnée mensuelle disponible
                </p>
                <p className="text-xs italic mt-1">
                  Les statistiques apparaîtront après les premières transactions
                </p>
              </div>
            )}
          </div>

          {/* Activités récentes */}
          <div className="bg-card p-8 rounded-3xl border border-card">
            <h4 className="text-heading font-bold mb-6 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              Activités récentes
            </h4>

            {data?.activitesRecentes && data.activitesRecentes.length > 0 ? (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                {data.activitesRecentes.map((activite, i) => {
                  const dateObj = new Date(activite.date);
                  const timeAgo = formatDistanceToNow(dateObj, {
                    addSuffix: true,
                    locale: fr,
                  });
                  const formattedDate = format(dateObj, "HH:mm");
                  const bgBorder = getTypeColor(activite.type);

                  return (
                    <div
                      key={i}
                      className={`flex gap-4 border-l-2 ${bgBorder} pl-4 py-2 hover:bg-table-row-hover rounded-r-xl transition-colors`}
                    >
                      <div className="flex flex-col gap-1 w-full">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(activite.type)}
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                              {activite.type}
                            </span>
                          </div>
                          <span className="text-[10px] text-muted font-mono">
                            {formattedDate}
                          </span>
                        </div>
                        <span className="text-sm text-primary leading-tight">
                          {activite.raison ||
                            (activite.type === "ENVOI"
                              ? "Envoi d'argent"
                              : "Retrait d'argent")}
                        </span>
                        <span className="text-xs font-mono font-bold text-heading">
                          {formatCurrency(activite.montant)}
                        </span>
                        <span className="text-[10px] text-blue-400 italic">
                          {timeAgo}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-muted">
                <Clock size={40} className="mb-3 opacity-50" />
                <p className="text-sm font-medium">Aucune activité récente</p>
                <p className="text-xs italic mt-1">
                  Les transactions récentes apparaîtront ici
                </p>
              </div>
            )}

            {/* Pied de la section activités */}
            {data?.activitesRecentes && data.activitesRecentes.length > 0 && (
              <div className="mt-6 pt-4 border-t border-card/50 text-center">
                <span className="text-xs text-muted">
                  {data.activitesRecentes.length} dernières transactions
                </span>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
