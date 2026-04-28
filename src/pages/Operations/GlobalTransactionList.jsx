import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Search, ArrowUpRight, ArrowDownLeft, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const GlobalTransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchDate, setSearchDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchGlobalTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/clients/global?date=${searchDate}`, 
        { headers }
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
    <div className="ml-64 p-8 bg-[#0f172a] min-h-screen flex-1 text-slate-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Flux Global</h1>
          <p className="text-slate-500 text-sm italic">Vue combinée des envois et retraits</p>
        </div>

        <div className="relative w-64">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="date" 
            value={searchDate}
            className="w-full bg-[#1e293b] border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-300"
            onChange={(e) => setSearchDate(e.target.value)}
          />
        </div>
      </div>

      {/* Tableau des transactions */}
      <div className="bg-[#1e293b] rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider font-bold">
            <tr>
              <th className="px-6 py-4">Heure</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Raison</th>
              <th className="px-6 py-4">Montant</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {transactions.length > 0 ? (
              transactions.map((tx, index) => (
                <tr key={index} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 text-xs font-mono text-slate-400">
                    {new Date(tx.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1.5 w-fit px-3 py-1 rounded-full text-[10px] font-bold ${
                      tx.type === 'ENVOI' 
                        ? 'bg-emerald-500/10 text-emerald-400' 
                        : 'bg-blue-500/10 text-blue-400'
                    }`}>
                      {tx.type === 'ENVOI' ? <ArrowUpRight size={12}/> : <ArrowDownLeft size={12}/>}
                      {tx.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300 italic">
                    {tx.raison || <span className="text-slate-600">Non spécifiée</span>}
                  </td>
                  <td className={`px-6 py-4 font-bold font-mono ${
                    tx.type === 'ENVOI' ? 'text-emerald-500' : 'text-blue-500'
                  }`}>
                    {Number(tx.montant).toLocaleString('de-DE')} Ar
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-slate-500 italic">
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
          <div className="bg-[#1e293b] p-4 rounded-xl border border-slate-700">
            <span className="text-slate-500">Total opérations :</span>
            <span className="ml-2 text-white font-bold">{transactions.length}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalTransactionList;