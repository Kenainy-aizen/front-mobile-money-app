import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Download, X, Save, Calendar, Info, Edit, Trash2, Plus, User, Hash, AlignLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const RetraitList = () => {
  const [retraits, setRetraits] = useState([]);
  const [searchDate, setSearchDate] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [retraitToDelete, setRetraitToDelete] = useState(null);

  // Ajout du champ "raison" dans l'objet initial
  const emptyRetrait = { 
    idrecep: null,
    numtel: '', 
    montant: '',
    raison: '' 
  };
  
  const [formData, setFormData] = useState(emptyRetrait);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchAllRetraits = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/retrait/all`, { headers });
      setRetraits(response.data.data || response.data);
    } catch (err) {
      toast.error("Erreur de chargement des retraits");
    }
  };

  const fetchSearchByDate = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/retrait/search?date=${searchDate}`, { headers });
      setRetraits(response.data);
    } catch (err) { console.error("Erreur recherche date"); }
  };

  useEffect(() => {
    if (searchDate === '') fetchAllRetraits();
    else fetchSearchByDate();
  }, [searchDate]);

  const openAddModal = () => {
    setIsEditMode(false);
    setFormData(emptyRetrait);
    setIsModalOpen(true);
  };

  const openEditModal = (retrait) => {
    setIsEditMode(true);
    setFormData({
      idrecep: retrait.idrecep,
      numtel: retrait.numtel,
      montant: retrait.montant,
      raison: retrait.raison || '' // On récupère la raison existante
    });
    setIsModalOpen(true);
  };

  const triggerDelete = (id) => {
    setRetraitToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditMode) {
        await axios.put(`http://localhost:8080/api/v1/retrait/retrait/${formData.idrecep}/update`, formData, { headers });
        toast.success("Retrait mis à jour !");
      } else {
        await axios.post(`http://localhost:8080/api/v1/retrait/add`, formData, { headers });
        toast.success("Retrait effectué avec succès !");
      }
      setIsModalOpen(false);
      fetchAllRetraits();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de l'opération");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/retrait/retrait/${retraitToDelete}/delete`, { headers });
      toast.success("Retrait supprimé");
      setShowDeleteConfirm(false);
      fetchAllRetraits();
    } catch (err) {
      toast.error("Erreur de suppression");
    }
  };

  return (
    <div className="ml-64 p-8 bg-[#0f172a] min-h-screen flex-1 text-slate-200">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Historique des Retraits</h1>
          <p className="text-slate-500 text-sm italic">Gestion des sorties d'argent</p>
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
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-900/20 transition-all transform active:scale-95"
          >
            <Plus size={20} /> Nouveau Retrait
          </button>
        </div>
      </div>

      <div className="bg-[#1e293b] rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider font-bold">
            <tr>
              <th className="px-6 py-4">Numéro Client</th>
              <th className="px-6 py-4 text-blue-400">Montant</th>
              <th className="px-6 py-4">Raison</th> {/* Nouvelle colonne */}
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {retraits.map((retrait) => (
              <tr key={retrait.idrecep} className="hover:bg-slate-800/40 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-white font-mono text-sm">
                    <User size={14} className="text-slate-500" /> {retrait.numtel}
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-blue-400">{retrait.montant.toLocaleString()} Ar</td>
                <td className="px-6 py-4 text-xs text-slate-400 italic max-w-[150px] truncate">
                  {retrait.raison || "---"} {/* Affichage raison */}
                </td>
                <td className="px-6 py-4 text-xs text-slate-400">
                  {new Date(retrait.daterecep).toLocaleString('fr-FR', {
                    dateStyle: 'short',
                    timeStyle: 'short'
                  })}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-3">
                    <button onClick={() => openEditModal(retrait)} className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition-all"><Edit size={16}/></button>
                    <button onClick={() => triggerDelete(retrait.idrecep)} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-600 hover:text-white transition-all"><Trash2 size={16}/></button>
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
                {isEditMode ? <Edit size={20} className="text-blue-500"/> : <Download size={20} className="text-blue-500"/>}
                {isEditMode ? 'Modifier Retrait' : 'Effectuer un Retrait'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Numéro du client</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input required type="text" value={formData.numtel} className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-3 pl-10 text-white outline-none focus:border-blue-500" onChange={(e) => setFormData({...formData, numtel: e.target.value})} placeholder="03x xx xxx xx" />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Montant (Ar)</label>
                <input required type="number" value={formData.montant} className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-3 text-blue-400 font-bold outline-none focus:border-blue-500 text-lg" onChange={(e) => setFormData({...formData, montant: e.target.value})} />
              </div>

              {/* Nouveau champ RAISON dans la modale */}
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Raison du retrait</label>
                <div className="relative">
                  <AlignLeft size={18} className="absolute left-3 top-3 text-slate-500" />
                  <textarea 
                    value={formData.raison} 
                    className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-3 pl-10 text-white outline-none focus:border-blue-500 h-24 resize-none" 
                    onChange={(e) => setFormData({...formData, raison: e.target.value})} 
                    placeholder="Ex: Retrait personnel, paiement fournisseur..."
                  />
                </div>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98]"
                >
                  {loading ? "Traitement..." : <><Save size={18} /> {isEditMode ? 'Mettre à jour' : 'Valider le retrait'}</>}
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
            <h2 className="text-xl font-bold text-white mb-2">Supprimer le retrait ?</h2>
            <p className="text-slate-400 text-sm mb-8">
              L'historique de ce retrait sera effacé définitivement.
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

export default RetraitList;