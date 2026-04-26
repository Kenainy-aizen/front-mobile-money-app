import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, UserPlus, Edit, Trash2, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const token = localStorage.getItem('token');

  const emptyClient = { numtel: '', nom: '', sexe: 'Masculin', age: '', solde: 0, mail: '' };
  const [formData, setFormData] = useState(emptyClient);
  const [isEditMode, setIsEditMode] = useState(false);

  const openAddModal = () => {
    setIsEditMode(false);
    setFormData(emptyClient);
    setIsModalOpen(true);
  };

  const fetchAllClients = async () => {
     try {
      
      const response = await axios.get(`http://localhost:8080/api/v1/clients/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setClients(response.data.data);

    } catch (err) { 
      toast.error("Erreur de connexion au serveur"); 
    }
  }

  useEffect(() => {
    fetchAllClients();
  },[]);

  const fetchClients = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/clients/search?query=${searchTerm}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClients(response.data);
    } catch (err) { toast.error("Erreur de connexion au serveur"); }
  };

  useEffect(() => { fetchClients(); }, [searchTerm]);

  const openEditModal = (client) => {
    setEditingClient({ ...client });
    setIsModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8080/api/v1/clients/client/${editingClient.numtel}/update`, 
        editingClient, 
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      toast.success("Client mis à jour !");
      setIsModalOpen(false);
      fetchClients();
    } catch (err) { toast.error("Erreur lors de la mise à jour"); }
  };


  const handleDelete = async (numtel) => {
    if (window.confirm("Supprimer définitivement ce client ?")) {
      try {
        await axios.delete(`http://localhost:8080/api/v1/clients/client/${numtel}/delete`, 
          {
            headers: {
              Authorization: `Bearer ${token}`
          }
          }
        );
        toast.success("Client supprimé avec succès");
        fetchClients();
      } catch (error) {
        toast.error("Erreur lors de la suppression");
      }
    }
  };
  return (
    <div className="ml-64 p-8 bg-[#0f172a] min-h-screen flex-1 text-slate-200">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">Clients Mobile Money</h1>
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Recherche (LIKE %...%)" 
            className="w-full bg-[#1e293b] border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500/50"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
            onClick={openAddModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-900/20 transition-all transform active:scale-95"
          >
            <Plus size={20} /> Nouveau
          </button>
      </div>

      <div className="bg-[#1e293b] rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider font-bold">
            <tr>
              <th className="px-6 py-4">Nom & Contact</th>
              <th className="px-6 py-4">Sexe/Age</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4 text-green-400">Solde</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {clients.map((client) => (
              <tr key={client.numtel} className="hover:bg-slate-800/40 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-white font-semibold">{client.nom}</div>
                  <div className="text-slate-500 text-xs">{client.numtel}</div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-400">{client.sexe}, {client.age} ans</td>
                <td className="px-6 py-4 text-sm text-slate-400">{client.mail} </td>
                <td className="px-6 py-4 font-mono font-bold text-green-500">{client.solde.toLocaleString()} Ar</td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-3">
                    <button onClick={() => openEditModal(client)} className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition-all"><Edit size={16}/></button>
                    <button onClick={() => handleDelete(client.numtel)} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-600 hover:text-white transition-all"><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODALE DE MODIFICATION */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#1e293b] w-full max-w-md rounded-3xl border border-slate-700 shadow-2xl animate-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Modifier le compte</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white"><X size={24} /></button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <input type="text" value={editingClient.nom} className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-blue-500" onChange={(e) => setEditingClient({...editingClient, nom: e.target.value})} placeholder="Nom complet" />
              <input type="email" value={editingClient.mail} className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-blue-500" onChange={(e) => setEditingClient({...editingClient, mail: e.target.value})} placeholder="Email" />
              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"><Save size={18} /> Sauvegarder</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientList;