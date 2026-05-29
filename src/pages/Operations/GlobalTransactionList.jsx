import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Calendar,
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  FileText,
} from "lucide-react";
import toast from "react-hot-toast";

const GlobalTransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchDate, setSearchDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchGlobalTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/clients/global?date=${searchDate}`,
        { headers },
      );
      setTransactions(response.data);
    } catch (err) {
      toast.error("Erreur lors de la récupération des données globales");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGlobalTransactions();
  }, [searchDate]);

  return (
    <div className="ml-64 p-8 bg-main min-h-screen flex-1 text-primary">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-heading tracking-tight">
            Flux Global
          </h1>
          <p className="text-secondary text-sm italic">
            Vue combinée des envois et retraits
          </p>
        </div>

        <div className="relative w-64">
          <Calendar
            className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary"
            size={18}
          />
          <input
            type="date"
            value={searchDate}
            className="w-full bg-card border border-card rounded-xl py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/50 text-primary"
            onChange={(e) => setSearchDate(e.target.value)}
          />
        </div>
      </div>

      {/* Tableau des transactions */}
      <div className="bg-card rounded-2xl border border-card shadow-card-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-table-head text-secondary text-xs uppercase tracking-wider font-bold">
            <tr>
              <th className="px-6 py-4">Heure</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Raison</th>
              <th className="px-6 py-4">Montant</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-card">
            {transactions.length > 0 ? (
              transactions.map((tx, index) => (
                <tr
                  key={index}
                  className="hover:bg-table-row-hover transition-colors"
                >
                  <td className="px-6 py-4 text-xs font-mono text-secondary">
                    {new Date(tx.date).toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`flex items-center gap-1.5 w-fit px-3 py-1 rounded-full text-[10px] font-bold ${
                        tx.type === "ENVOI"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-blue-500/10 text-blue-400"
                      }`}
                    >
                      {tx.type === "ENVOI" ? (
                        <ArrowUpRight size={12} />
                      ) : (
                        <ArrowDownLeft size={12} />
                      )}
                      {tx.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-primary italic">
                    {tx.raison || (
                      <span className="text-muted">Non spécifiée</span>
                    )}
                  </td>
                  <td
                    className={`px-6 py-4 font-bold font-mono ${
                      tx.type === "ENVOI" ? "text-emerald-500" : "text-blue-500"
                    }`}
                  >
                    {Number(tx.montant).toLocaleString("de-DE")} Ar
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="px-6 py-12 text-center text-secondary italic"
                >
                  Aucune transaction enregistrée pour cette date.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Résumé rapide en bas */}
      {transactions.length > 0 && (
        <div className="mt-6 flex justify-end gap-6 text-sm">
          <div className="bg-card p-4 rounded-xl border border-card">
            <span className="text-secondary">Total opérations :</span>
            <span className="ml-2 text-heading font-bold">
              {transactions.length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalTransactionList;
