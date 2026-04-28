import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Send, X, Save, Calendar, Info, ArrowRight, Mail, Edit, Trash2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const EnvoiList = () => {
  const [envois, setEnvois] = useState([]);
  const [searchDate, setSearchDate] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [envoiToDelete, setEnvoiToDelete] = useState(null);

  const emptyEnvoi = { 
    idEnv: null,
    numEnvoyeur: '', 
    numRecepteur: '', 
    montant: '', 
    payer_frais_retrait: false, 
    raison: '' // Initialisé ici
  };
  
  const [formData, setFormData] = useState(emptyEnvoi);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchAllEnvois = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/envoi/all`, { headers });
      setEnvois(response.data.data || response.data);
    } catch (err) {
      toast.error("Erreur de chargement des transferts");
    }
  };

  const fetchSearchByDate = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/envoi/search?date=${searchDate}`, { headers });
      setEnvois(response.data);
    } catch (err) { console.error("Erreur recherche date"); }
  };

  useEffect(() => {
    if (searchDate === '') fetchAllEnvois();
    else fetchSearchByDate();
  }, [searchDate]);

  const openAddModal = () => {
    setIsEditMode(false);
    setFormData(emptyEnvoi);
    setIsModalOpen(true);
  };

  const openEditModal = (envoi) => {
    setIsEditMode(true);
    setFormData({ ...envoi });
    setIsModalOpen(true);
  };

  const triggerDelete = (id) => {
    setEnvoiToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditMode) {
        await axios.put(`http://localhost:8080/api/v1/envoi/envoi/${formData.idEnv}/update`, formData, { headers });
        toast.success("Transaction mise à jour !");
      } else {
        await axios.post(`http://localhost:8080/api/v1/envoi/add`, formData, { headers });
        toast.success("Transfert réussi et emails envoyés !");
      }
      setIsModalOpen(false);
      fetchAllEnvois();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de l'opération");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/envoi/envoi/${envoiToDelete}/delete`, { headers });
      toast.success("Enregistrement supprimé");
      setShowDeleteConfirm(false);
      fetchAllEnvois();
    } catch (err) {
      toast.error("Erreur de suppression");
    }
  };

  return (
    <div className="ml-64 p-8 bg-[#0f172a] min-h-screen flex-1 text-slate-200">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Historique des Envois</h1>
          <p className="text-slate-500 text-sm italic">Suivi des transferts d'argent</p>
        </div>

        <div className="flex gap-4">
          <div className="relative w-64">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="date" 
              className="w-full bg-[#1e293b] border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-300"
              onChange={(e) => setSearchDate(e.target.value)}
            />
          </div>
          <button 
            onClick={openAddModal}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-900/20 transition-all transform active:scale-95"
          >
            <Plus size={20} /> Nouveau Transfert
          </button>
        </div>
      </div>

      <div className="bg-[#1e293b] rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider font-bold">
            <tr>
              <th className="px-6 py-4">Expéditeur → Destinateur</th>
              <th className="px-6 py-4 text-emerald-400">Montant</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Raison</th>
              <th className="px-6 py-4">Frais</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {envois.map((envoi) => (
              <tr key={envoi.idEnv} className="hover:bg-slate-800/40 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-white font-mono text-sm">{envoi.numEnvoyeur}</span>
                    <ArrowRight size={14} className="text-slate-500" />
                    <span className="text-white font-mono text-sm">{envoi.numRecepteur}</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-emerald-500">{envoi.montant.toLocaleString()} Ar</td>
                <td className="px-6 py-4 text-xs text-slate-400">
                  {new Date(envoi.date).toLocaleString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </td>
                <td className="px-6 py-4 text-xs text-slate-500 italic max-w-[120px] truncate">
                  {envoi.raison || "Aucune"} 
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${envoi.payer_frais_retrait ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-700 text-slate-400'}`}>
                    {envoi.payer_frais_retrait ? 'OUI' : 'NON'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-3">
                    <button onClick={() => openEditModal(envoi)} className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition-all transition-all"><Edit size={16}/></button>
                    <button onClick={() => triggerDelete(envoi.idEnv)} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-600 hover:text-white transition-all"><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#1e293b] w-full max-w-lg rounded-3xl border border-slate-700 shadow-2xl animate-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                {isEditMode ? <Edit size={20} className="text-blue-500"/> : <Send size={20} className="text-emerald-500"/>}
                {isEditMode ? 'Modifier Transaction' : 'Nouveau Transfert'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Numéro Envoyeur</label>
                  <input required type="text" value={formData.numEnvoyeur} className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500" onChange={(e) => setFormData({...formData, numEnvoyeur: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Numéro Récepteur</label>
                  <input required type="text" value={formData.numRecepteur} className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500" onChange={(e) => setFormData({...formData, numRecepteur: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Montant (Ar)</label>
                <input required type="number" value={formData.montant} className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-3 text-emerald-400 font-bold outline-none focus:border-emerald-500 text-lg" onChange={(e) => setFormData({...formData, montant: e.target.value})} />
              </div>

              {/* Champ RAISON ajouté ici */}
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Raison de l'envoi</label>
                <textarea 
                  value={formData.raison} 
                  className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500 h-24 resize-none" 
                  onChange={(e) => setFormData({...formData, raison: e.target.value})} 
                  placeholder="Ex: Frais de scolarité, cadeau..."
                />
              </div>

              <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-700">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-0"
                    checked={formData.payer_frais_retrait}
                    onChange={(e) => setFormData({...formData, payer_frais_retrait: e.target.checked})}
                  />
                  <span className="text-sm text-slate-300 font-medium italic">Prendre en charge les frais de retrait</span>
                </label>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  {loading ? "Chargement..." : <><Save size={18} /> {isEditMode ? 'Enregistrer les modifications' : 'Confirmer le transfert'}</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="bg-[#1e293b] w-full max-w-sm rounded-3xl border border-slate-700 shadow-2xl p-8 text-center animate-in zoom-in duration-200">
            <div className="bg-red-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
              <Trash2 size={40} />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Supprimer l'historique ?</h2>
            <p className="text-slate-400 text-sm mb-8">
              Cette action supprimera uniquement la trace de cette transaction dans l'historique.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 bg-slate-800 text-white font-bold py-3 rounded-xl">Annuler</button>
              <button onClick={confirmDelete} className="flex-1 bg-red-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-red-600/20 transition-all active:scale-95">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnvoiList;