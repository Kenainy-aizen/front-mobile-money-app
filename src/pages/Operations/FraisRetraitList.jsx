import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Settings2, X, Save, Edit, Trash2, Plus, Percent, Wallet } from 'lucide-react';
import toast from 'react-hot-toast';

const FraisRetraitList = () => {
  const [frais, setFrais] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [fraisToDelete, setFraisToDelete] = useState(null);

  const emptyFrais = {
    idRec: null,
    montant1: '',
    montant2: '',
    frais_rec: ''
  };

  const [formData, setFormData] = useState(emptyFrais);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchAllFrais = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/FraisRecep/all`, { headers });
      setFrais(response.data.data || response.data);
    } catch (err) {
      toast.error("Erreur de chargement des tarifs de retrait");
    }
  };

  useEffect(() => {
    fetchAllFrais();
  }, []);

  const openAddModal = () => {
    setIsEditMode(false);
    setFormData(emptyFrais);
    setIsModalOpen(true);
  };

  const openEditModal = (f) => {
    setIsEditMode(true);
    setFormData({ ...f });
    setIsModalOpen(true);
  };

  const triggerDelete = (id) => {
    setFraisToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditMode) {
        await axios.put(`http://localhost:8080/api/v1/FraisRecep/FraisRecep/${formData.idRec}/update`, formData, { headers });
        toast.success("Tarif de retrait mis à jour !");
      } else {
        await axios.post(`http://localhost:8080/api/v1/FraisRecep/add`, formData, { headers });
        toast.success("Tranche de retrait ajoutée !");
      }
      setIsModalOpen(false);
      fetchAllFrais();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de l'opération");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/FraisRecep/FraisRecep/${fraisToDelete}/delete`, { headers });
      toast.success("Tranche supprimée");
      setShowDeleteConfirm(false);
      fetchAllFrais();
    } catch (err) {
      toast.error("Erreur de suppression");
    }
  };

  return (
    <div className="ml-64 p-8 bg-[#0f172a] min-h-screen flex-1 text-slate-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Frais de Retrait</h1>
          <p className="text-slate-500 text-sm italic">Configuration des commissions sur les retraits</p>
        </div>

        <button 
          onClick={openAddModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-900/20 transition-all transform active:scale-95"
        >
          <Plus size={20} /> Nouvelle tranche
        </button>
      </div>

      {/* Tableau (Sans espaces pour éviter l'erreur de hydration) */}
      <div className="bg-[#1e293b] rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider font-bold">
            <tr>
              <th className="px-6 py-4">Tranche Minimum</th>
              <th className="px-6 py-4">Tranche Maximum</th>
              <th className="px-6 py-4 text-indigo-400">Commission</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {frais.map((f) => (
              <tr key={f.idRec} className="hover:bg-slate-800/40 transition-colors group">
                <td className="px-6 py-4 font-mono text-slate-300">{f.montant1.toLocaleString()} Ar</td>
                <td className="px-6 py-4 font-mono text-slate-300">{f.montant2.toLocaleString()} Ar</td>
                <td className="px-6 py-4 font-bold text-indigo-400">{f.frais_rec.toLocaleString()} Ar</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-3">
                    <button onClick={() => openEditModal(f)} className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition-all"><Edit size={16}/></button>
                    <button onClick={() => triggerDelete(f.idRec)} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-600 hover:text-white transition-all"><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modale Formulaire */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#1e293b] w-full max-w-md rounded-3xl border border-slate-700 shadow-2xl animate-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                {isEditMode ? <Settings2 size={20} className="text-indigo-500"/> : <Wallet size={20} className="text-indigo-500"/>}
                {isEditMode ? 'Modifier Commission' : 'Définir Commission'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Min (Ar)</label>
                  <input required type="number" value={formData.montant1} className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-indigo-500" onChange={(e) => setFormData({...formData, montant1: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Max (Ar)</label>
                  <input required type="number" value={formData.montant2} className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-indigo-500" onChange={(e) => setFormData({...formData, montant2: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-1 text-indigo-400">Montant des frais (Ar)</label>
                <div className="relative">
                  <Percent size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500" />
                  <input required type="number" value={formData.frais_rec} className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-3 pl-10 text-indigo-400 font-bold text-xl outline-none focus:border-indigo-500" onChange={(e) => setFormData({...formData, frais_rec: e.target.value})} />
                </div>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  {loading ? "Chargement..." : <><Save size={18} /> {isEditMode ? 'Appliquer les changements' : 'Valider la commission'}</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modale Suppression */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 ">
          <div className="bg-[#1e293b] w-full max-w-sm rounded-3xl border border-slate-700 shadow-2xl p-8 text-center animate-in zoom-in duration-200">
            <div className="bg-red-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
              <Trash2 size={40} />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Supprimer ce tarif ?</h2>
            <p className="text-slate-400 text-sm mb-8">Cette modification impactera immédiatement les retraits futurs des clients.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 bg-slate-800 text-white font-bold py-3 rounded-xl">Annuler</button>
              <button onClick={confirmDelete} className="flex-1 bg-red-600 text-white font-bold py-3 rounded-xl">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FraisRetraitList;