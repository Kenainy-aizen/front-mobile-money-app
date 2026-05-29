import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, UserPlus, Edit, Trash2, X, Save, Plus } from "lucide-react";
import toast from "react-hot-toast";
import {
  validateClientForm,
  hasErrors,
  sanitizeName,
  sanitizePhone,
  sanitizeNumeric,
} from "../../utils/validation";

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);

  const emptyClient = {
    numtel: "",
    nom: "",
    sexe: "Masculin",
    age: "",
    solde: 0,
    mail: "",
  };
  const [formData, setFormData] = useState(emptyClient);
  const [isEditMode, setIsEditMode] = useState(false);
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    const testData = { ...formData, [name]: value };
    const newErrors = validateClientForm(testData);
    setErrors((prev) => ({ ...prev, [name]: newErrors[name] }));
  };

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const triggerDelete = (numtel) => {
    setClientToDelete(numtel);
    setShowDeleteConfirm(true);
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setFormData(emptyClient);
    setErrors({});
    setIsModalOpen(true);
  };

  const fetchAllClients = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/clients/all`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setClients(response.data.data);
    } catch (err) {
      toast.error("Erreur de connexion au serveur");
    }
  };

  useEffect(() => {
    fetchAllClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/clients/search?query=${searchTerm}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setClients(response.data);
    } catch (err) {
      toast.error("Erreur de connexion au serveur");
    }
  };

  useEffect(() => {
    fetchClients();
  }, [searchTerm]);

  const openEditModal = (client) => {
    setIsEditMode(true);
    setFormData({ ...client });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateClientForm(formData);
    setErrors(validationErrors);
    if (hasErrors(validationErrors)) {
      toast.error("Veuillez corriger les erreurs avant de continuer");
      return;
    }
    try {
      if (isEditMode) {
        // UPDATE
        await axios.put(
          `http://localhost:8080/api/v1/clients/client/${formData.numtel}/update`,
          formData,
          { headers },
        );
        toast.success("Client mis à jour !");
      } else {
        // CREATE
        await axios.post(`http://localhost:8080/api/v1/clients/add`, formData, {
          headers,
        });
        toast.success("Client ajouté avec succès !");
      }
      setIsModalOpen(false);
      fetchAllClients();
    } catch (err) {
      toast.error(
        isEditMode ? "Erreur de mise à jour" : "Erreur lors de l'ajout",
      );
    }
  };

  const handleDelete = async (numtel) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/v1/clients/client/${numtel}/delete`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success("Client supprimé avec succès");
      fetchClients();
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  return (
    <div className="ml-64 p-8 bg-main min-h-screen flex-1 text-primary">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-heading">
          Clients Mobile Money
        </h1>
        <div className="flex space-x-3.5">
          <div className="relative w-80">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              size={18}
            />
            <input
              type="text"
              placeholder="Recherche (LIKE %...%)"
              className="w-full bg-card border border-card rounded-xl py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500/50"
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
      </div>

      <div className="bg-card rounded-2xl border border-card shadow-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-table-head text-secondary text-xs uppercase tracking-wider font-bold">
            <tr>
              <th className="px-6 py-4">Nom & Contact</th>
              <th className="px-6 py-4">Sexe/Age</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4 text-green-400">Solde</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-card">
            {clients.map((client) => (
              <tr
                key={client.numtel}
                className="hover:bg-table-row-hover transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="text-primary font-semibold">{client.nom}</div>
                  <div className="text-muted text-xs">{client.numtel}</div>
                </td>
                <td className="px-6 py-4 text-sm text-secondary">
                  {client.sexe}, {client.age} ans
                </td>
                <td className="px-6 py-4 text-sm text-secondary">
                  {client.mail}{" "}
                </td>
                <td className="px-6 py-4 font-mono font-bold text-green-500">
                  {client.solde.toLocaleString()} Ar
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => openEditModal(client)}
                      className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => triggerDelete(client.numtel)}
                      className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODALE UNIQUE (AJOUT / MODIF) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card w-full max-w-lg rounded-3xl border border-card shadow-2xl animate-in zoom-in duration-200">
            <div className="p-6 border-b border-card flex justify-between items-center">
              <h2 className="text-xl font-bold text-heading flex items-center gap-2">
                {isEditMode ? (
                  <Edit size={20} className="text-blue-500" />
                ) : (
                  <Plus size={20} className="text-green-500" />
                )}
                {isEditMode ? "Modifier Client" : "Nouveau Client"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-secondary hover:text-primary transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[10px] uppercase font-bold text-muted ml-1">
                    Nom Complet
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.nom}
                    className={`w-full bg-input border ${errors.nom ? "border-red-500" : "border-card"} rounded-xl p-3 text-primary outline-none focus:border-blue-500 transition-colors`}
                    onChange={(e) => {
                      const cleaned = sanitizeName(e.target.value);
                      setFormData({ ...formData, nom: cleaned });
                      validateField("nom", cleaned);
                    }}
                    placeholder="Ex: Jean Bernard"
                  />
                  {errors.nom && (
                    <p className="text-red-400 text-xs mt-1 ml-1">
                      {errors.nom}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-muted ml-1">
                    Numéro Téléphone
                  </label>
                  <input
                    required
                    disabled={isEditMode}
                    type="text"
                    maxLength="10"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={formData.numtel}
                    className={`w-full bg-input border ${errors.numtel ? "border-red-500" : "border-card"} rounded-xl p-3 text-primary outline-none focus:border-blue-500 transition-colors ${isEditMode && "opacity-50 cursor-not-allowed"}`}
                    onChange={(e) => {
                      const cleaned = sanitizePhone(e.target.value);
                      setFormData({ ...formData, numtel: cleaned });
                      validateField("numtel", cleaned);
                    }}
                    placeholder="0340000000"
                  />
                  {errors.numtel && (
                    <p className="text-red-400 text-xs mt-1 ml-1">
                      {errors.numtel}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-muted ml-1">
                    Solde Initial (Ar)
                  </label>
                  <input
                    required
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength="10"
                    value={formData.solde}
                    className={`w-full bg-input border ${errors.solde ? "border-red-500" : "border-card"} rounded-xl p-3 text-primary outline-none focus:border-blue-500 transition-colors`}
                    onChange={(e) => {
                      const cleaned = sanitizeNumeric(e.target.value);
                      setFormData({ ...formData, solde: cleaned });
                      validateField("solde", cleaned);
                    }}
                  />
                  {errors.solde && (
                    <p className="text-red-400 text-xs mt-1 ml-1">
                      {errors.solde}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-muted ml-1">
                    Âge
                  </label>
                  <input
                    required
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength="3"
                    value={formData.age}
                    className={`w-full bg-input border ${errors.age ? "border-red-500" : "border-card"} rounded-xl p-3 text-primary outline-none focus:border-blue-500 transition-colors`}
                    onChange={(e) => {
                      const cleaned = sanitizeNumeric(e.target.value);
                      setFormData({ ...formData, age: cleaned });
                      validateField("age", cleaned);
                    }}
                  />
                  {errors.age && (
                    <p className="text-red-400 text-xs mt-1 ml-1">
                      {errors.age}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-muted ml-1">
                    Sexe
                  </label>
                  <select
                    value={formData.sexe}
                    className={`w-full bg-input border ${errors.sexe ? "border-red-500" : "border-card"} rounded-xl p-3 text-primary outline-none focus:border-blue-500 transition-colors`}
                    onChange={(e) => {
                      setFormData({ ...formData, sexe: e.target.value });
                      validateField("sexe", e.target.value);
                    }}
                  >
                    <option value="Masculin">Masculin</option>
                    <option value="Féminin">Féminin</option>
                  </select>
                  {errors.sexe && (
                    <p className="text-red-400 text-xs mt-1 ml-1">
                      {errors.sexe}
                    </p>
                  )}
                </div>

                <div className="col-span-2">
                  <label className="text-[10px] uppercase font-bold text-muted ml-1">
                    Adresse Email
                  </label>
                  <input
                    required
                    type="email"
                    value={formData.mail}
                    className={`w-full bg-input border ${errors.mail ? "border-red-500" : "border-card"} rounded-xl p-3 text-primary outline-none focus:border-blue-500 transition-colors`}
                    onChange={(e) => {
                      const cleaned = e.target.value.replace(
                        /[^a-zA-Z0-9@._-]/g,
                        "",
                      );
                      setFormData({ ...formData, mail: cleaned });
                      validateField("mail", cleaned);
                    }}
                    placeholder="client@gmail.com"
                  />
                  {errors.mail && (
                    <p className="text-red-400 text-xs mt-1 ml-1">
                      {errors.mail}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20"
                >
                  <Save size={18} />{" "}
                  {isEditMode
                    ? "Enregistrer les modifications"
                    : "Créer le client"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODALE DE CONFIRMATION DE SUPPRESSION DESIGN */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="bg-card w-full max-w-sm rounded-3xl border border-card shadow-2xl p-8 text-center animate-in zoom-in duration-200">
            <div className="bg-red-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
              <Trash2 size={40} />
            </div>

            <h2 className="text-xl font-bold text-heading mb-2">
              Êtes-vous sûr ?
            </h2>
            <p className="text-secondary text-sm mb-8">
              Cette action est irréversible. Le compte client{" "}
              <span className="text-red-400 font-mono">{clientToDelete}</span>{" "}
              sera définitivement supprimé.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-element hover:bg-hover text-primary font-bold py-3 rounded-xl transition-all"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-red-600/20 transition-all active:scale-95"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientList;
