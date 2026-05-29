import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  Send,
  X,
  Save,
  Calendar,
  Info,
  ArrowRight,
  Mail,
  Edit,
  Trash2,
  Plus,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  validateEnvoiForm,
  hasErrors,
  sanitizePhone,
  sanitizeNumeric,
  sanitizeRaison,
} from "../../utils/validation";

const EnvoiList = () => {
  const [envois, setEnvois] = useState([]);
  const [searchDate, setSearchDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [envoiToDelete, setEnvoiToDelete] = useState(null);

  const emptyEnvoi = {
    idEnv: null,
    numEnvoyeur: "",
    numRecepteur: "",
    montant: "",
    payer_frais_retrait: false,
    raison: "", // Initialisé ici
  };

  const [formData, setFormData] = useState(emptyEnvoi);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateField = (name, value) => {
    const testData = { ...formData, [name]: value };
    const newErrors = validateEnvoiForm(testData);
    setErrors((prev) => ({ ...prev, [name]: newErrors[name] }));
  };

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchAllEnvois = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/envoi/all`,
        { headers },
      );
      setEnvois(response.data.data || response.data);
    } catch (err) {
      toast.error("Erreur de chargement des transferts");
    }
  };

  const fetchSearchByDate = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/envoi/search?date=${searchDate}`,
        { headers },
      );
      setEnvois(response.data);
    } catch (err) {
      console.error("Erreur recherche date");
    }
  };

  useEffect(() => {
    if (searchDate === "") fetchAllEnvois();
    else fetchSearchByDate();
  }, [searchDate]);

  const openAddModal = () => {
    setIsEditMode(false);
    setFormData(emptyEnvoi);
    setErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (envoi) => {
    setIsEditMode(true);
    setFormData({ ...envoi });
    setErrors({});
    setIsModalOpen(true);
  };

  const triggerDelete = (id) => {
    setEnvoiToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateEnvoiForm(formData);
    setErrors(validationErrors);
    if (hasErrors(validationErrors)) {
      toast.error("Veuillez corriger les erreurs avant de continuer");
      return;
    }
    setLoading(true);
    try {
      if (isEditMode) {
        await axios.put(
          `http://localhost:8080/api/v1/envoi/envoi/${formData.idEnv}/update`,
          formData,
          { headers },
        );
        toast.success("Transaction mise à jour !");
      } else {
        await axios.post(`http://localhost:8080/api/v1/envoi/add`, formData, {
          headers,
        });
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
      await axios.delete(
        `http://localhost:8080/api/v1/envoi/envoi/${envoiToDelete}/delete`,
        { headers },
      );
      toast.success("Enregistrement supprimé");
      setShowDeleteConfirm(false);
      fetchAllEnvois();
    } catch (err) {
      toast.error("Erreur de suppression");
    }
  };

  return (
    <div className="ml-64 p-8 bg-main min-h-screen flex-1 text-primary">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-heading tracking-tight">
            Historique des Envois
          </h1>
          <p className="text-muted text-sm italic">
            Suivi des transferts d'argent
          </p>
        </div>

        <div className="flex gap-4">
          <div className="relative w-64">
            <Calendar
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              size={18}
            />
            <input
              type="date"
              className="w-full bg-card border border-card rounded-xl py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-300"
              onChange={(e) => setSearchDate(e.target.value)}
            />
          </div>
          <button
            onClick={openAddModal}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-card shadow-emerald-900/20 transition-all transform active:scale-95"
          >
            <Plus size={20} /> Nouveau Transfert
          </button>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-card shadow-card-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-table-head text-secondary text-xs uppercase tracking-wider font-bold">
            <tr>
              <th className="px-6 py-4">Expéditeur → Destinateur</th>
              <th className="px-6 py-4 text-emerald-400">Montant</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Raison</th>
              <th className="px-6 py-4">Frais</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-card">
            {envois.map((envoi) => (
              <tr
                key={envoi.idEnv}
                className="bg-table-row-hover transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-primary font-mono text-sm">
                      {envoi.numEnvoyeur}
                    </span>
                    <ArrowRight size={14} className="text-muted" />
                    <span className="text-primary font-mono text-sm">
                      {envoi.numRecepteur}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-emerald-500">
                  {envoi.montant.toLocaleString()} Ar
                </td>
                <td className="px-6 py-4 text-xs text-secondary">
                  {new Date(envoi.date).toLocaleString("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="px-6 py-4 text-xs text-muted italic max-w-[120px] truncate">
                  {envoi.raison || "Aucune"}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-[10px] font-bold ${envoi.payer_frais_retrait ? "bg-blue-500/10 text-blue-400" : "bg-slate-700 text-secondary"}`}
                  >
                    {envoi.payer_frais_retrait ? "OUI" : "NON"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => openEditModal(envoi)}
                      className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition-all transition-all"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => triggerDelete(envoi.idEnv)}
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card w-full max-w-lg rounded-3xl border border-card shadow-card-lg animate-in zoom-in duration-200">
            <div className="p-6 border-b border-card flex justify-between items-center">
              <h2 className="text-xl font-bold text-heading flex items-center gap-2">
                {isEditMode ? (
                  <Edit size={20} className="text-blue-500" />
                ) : (
                  <Send size={20} className="text-emerald-500" />
                )}
                {isEditMode ? "Modifier Transaction" : "Nouveau Transfert"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-secondary hover:text-primary"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-muted ml-1">
                    Numéro Envoyeur
                  </label>
                  <input
                    required
                    type="text"
                    maxLength="10"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={formData.numEnvoyeur}
                    className={`w-full bg-input border ${errors.numEnvoyeur ? "border-red-500" : "border-card"} rounded-xl p-3 text-primary outline-none focus:border-emerald-500`}
                    onChange={(e) => {
                      const cleaned = sanitizePhone(e.target.value);
                      setFormData({ ...formData, numEnvoyeur: cleaned });
                      validateField("numEnvoyeur", cleaned);
                    }}
                  />
                  {errors.numEnvoyeur && (
                    <p className="text-red-500 text-xs mt-1 ml-1">
                      {errors.numEnvoyeur}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-muted ml-1">
                    Numéro Récepteur
                  </label>
                  <input
                    required
                    type="text"
                    maxLength="10"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={formData.numRecepteur}
                    className={`w-full bg-input border ${errors.numRecepteur ? "border-red-500" : "border-card"} rounded-xl p-3 text-primary outline-none focus:border-emerald-500`}
                    onChange={(e) => {
                      const cleaned = sanitizePhone(e.target.value);
                      setFormData({ ...formData, numRecepteur: cleaned });
                      validateField("numRecepteur", cleaned);
                    }}
                  />
                  {errors.numRecepteur && (
                    <p className="text-red-500 text-xs mt-1 ml-1">
                      {errors.numRecepteur}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-muted ml-1">
                  Montant (Ar)
                </label>
                <input
                  required
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength="9"
                  value={formData.montant}
                  className={`w-full bg-input border ${errors.montant ? "border-red-500" : "border-card"} rounded-xl p-3 text-emerald-400 font-bold outline-none focus:border-emerald-500 text-lg`}
                  onChange={(e) => {
                    const cleaned = sanitizeNumeric(e.target.value);
                    setFormData({ ...formData, montant: cleaned });
                    validateField("montant", cleaned);
                  }}
                />
                {errors.montant && (
                  <p className="text-red-500 text-xs mt-1 ml-1">
                    {errors.montant}
                  </p>
                )}
              </div>

              {/* Champ RAISON ajouté ici */}
              <div>
                <label className="text-[10px] uppercase font-bold text-muted ml-1">
                  Raison de l'envoi
                </label>
                <textarea
                  value={formData.raison}
                  className={`w-full bg-input border ${errors.raison ? "border-red-500" : "border-card"} rounded-xl p-3 text-primary outline-none focus:border-emerald-500 h-24 resize-none`}
                  onChange={(e) => {
                    const cleaned = sanitizeRaison(e.target.value);
                    setFormData({ ...formData, raison: cleaned });
                    validateField("raison", cleaned);
                  }}
                  placeholder="Ex: Frais de scolarité, cadeau..."
                />
                {errors.raison && (
                  <p className="text-red-500 text-xs mt-1 ml-1">
                    {errors.raison}
                  </p>
                )}
              </div>

              <div className="bg-input p-4 rounded-2xl border border-card">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-card bg-element text-blue-600 focus:ring-0"
                    checked={formData.payer_frais_retrait}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        payer_frais_retrait: e.target.checked,
                      })
                    }
                  />
                  <span className="text-sm text-slate-300 font-medium italic">
                    Prendre en charge les frais de retrait
                  </span>
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  {loading ? (
                    "Chargement..."
                  ) : (
                    <>
                      <Save size={18} />{" "}
                      {isEditMode
                        ? "Enregistrer les modifications"
                        : "Confirmer le transfert"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="bg-card w-full max-w-sm rounded-3xl border border-card shadow-card-lg p-8 text-center animate-in zoom-in duration-200">
            <div className="bg-red-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
              <Trash2 size={40} />
            </div>
            <h2 className="text-xl font-bold text-heading mb-2">
              Supprimer l'historique ?
            </h2>
            <p className="text-secondary text-sm mb-8">
              Cette action supprimera uniquement la trace de cette transaction
              dans l'historique.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-element text-primary font-bold py-3 rounded-xl"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 text-white font-bold py-3 rounded-xl shadow-card shadow-red-600/20 transition-all active:scale-95"
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

export default EnvoiList;
