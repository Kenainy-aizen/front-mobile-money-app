import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Settings,
  X,
  Save,
  Edit,
  Trash2,
  Plus,
  BarChart3,
  Coins,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  validateFraisEnvoiForm,
  hasErrors,
  sanitizeNumeric,
} from "../../utils/validation";

const FraisEnvoiList = () => {
  const [frais, setFrais] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [fraisToDelete, setFraisToDelete] = useState(null);

  const emptyFrais = {
    idEnv: null,
    montant1: "",
    montant2: "",
    frais_env: "",
  };

  const [formData, setFormData] = useState(emptyFrais);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateField = (name, value) => {
    const testData = { ...formData, [name]: value };
    const newErrors = validateFraisEnvoiForm(testData);
    setErrors((prev) => ({ ...prev, [name]: newErrors[name] }));
  };

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchAllFrais = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/FraisEnvoi/all`,
        { headers },
      );
      setFrais(response.data.data || response.data);
    } catch (err) {
      toast.error("Erreur de chargement des tarifs");
    }
  };

  useEffect(() => {
    fetchAllFrais();
  }, []);

  const openAddModal = () => {
    setIsEditMode(false);
    setFormData(emptyFrais);
    setErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (f) => {
    setIsEditMode(true);
    setFormData({ ...f });
    setErrors({});
    setIsModalOpen(true);
  };

  const triggerDelete = (id) => {
    setFraisToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateFraisEnvoiForm(formData);
    setErrors(validationErrors);
    if (hasErrors(validationErrors)) {
      toast.error("Veuillez corriger les erreurs avant de continuer");
      return;
    }
    setLoading(true);
    try {
      if (isEditMode) {
        await axios.put(
          `http://localhost:8080/api/v1/FraisEnvoi/FraisEnvoi/${formData.idEnv}/update`,
          formData,
          { headers },
        );
        toast.success("Frais d'envoi mis à jour !");
      } else {
        await axios.post(
          `http://localhost:8080/api/v1/FraisEnvoi/add`,
          formData,
          { headers },
        );
        toast.success("Frais d'envoi ajoutés !");
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
      await axios.delete(
        `http://localhost:8080/api/v1/FraisEnvoi/FraisEnvoi/${fraisToDelete}/delete`,
        { headers },
      );
      toast.success("Tranche supprimée");
      setShowDeleteConfirm(false);
      fetchAllFrais();
    } catch (err) {
      toast.error("Erreur de suppression");
    }
  };

  return (
    <div className="ml-64 p-8 bg-main min-h-screen flex-1 text-primary">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-heading tracking-tight">
            Configuration des Frais
          </h1>
          <p className="text-muted text-sm italic">
            Définition des tarifs par tranche de montant
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-card shadow-amber-900/20 transition-all transform active:scale-95"
        >
          <Plus size={20} /> Ajouter une tranche
        </button>
      </div>

      {/* Tableau avec correction Hydration (pas d'espaces entre <tr> et <td>) */}
      <div className="bg-card rounded-2xl border border-card shadow-card-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-table-head text-secondary text-xs uppercase tracking-wider font-bold">
            <tr>
              <th className="px-6 py-4">Montant Minimum</th>
              <th className="px-6 py-4">Montant Maximum</th>
              <th className="px-6 py-4 text-amber-400">Frais d'envoi</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-card">
            {frais.map((f) => (
              <tr
                key={f.idEnv}
                className="hover:bg-table-row-hover transition-colors group"
              >
                <td className="px-6 py-4 font-mono text-slate-300">
                  {f.montant1.toLocaleString()} Ar
                </td>
                <td className="px-6 py-4 font-mono text-slate-300">
                  {f.montant2.toLocaleString()} Ar
                </td>
                <td className="px-6 py-4 font-bold text-amber-500">
                  {f.frais_env.toLocaleString()} Ar
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => openEditModal(f)}
                      className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => triggerDelete(f.idEnv)}
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

      {/* Modale Formulaire */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card w-full max-w-md rounded-3xl border border-card shadow-card-lg animate-in zoom-in duration-200">
            <div className="p-6 border-b border-card flex justify-between items-center">
              <h2 className="text-xl font-bold text-heading flex items-center gap-2">
                {isEditMode ? (
                  <Settings size={20} className="text-amber-500" />
                ) : (
                  <Plus size={20} className="text-amber-500" />
                )}
                {isEditMode ? "Modifier Tarif" : "Nouveau Tarif"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-secondary hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-muted ml-1">
                    Min (Ar)
                  </label>
                  <input
                    required
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength="9"
                    value={formData.montant1}
                    className={`w-full bg-input border ${errors.montant1 ? "border-red-500" : "border-card"} rounded-xl p-3 text-white outline-none focus:border-amber-500`}
                    onChange={(e) => {
                      const cleaned = sanitizeNumeric(e.target.value);
                      setFormData({ ...formData, montant1: cleaned });
                      validateField("montant1", cleaned);
                    }}
                  />
                  {errors.montant1 && (
                    <p className="text-red-500 text-xs mt-1 ml-1">
                      {errors.montant1}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-muted ml-1">
                    Max (Ar)
                  </label>
                  <input
                    required
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength="9"
                    value={formData.montant2}
                    className={`w-full bg-input border ${errors.montant2 ? "border-red-500" : "border-card"} rounded-xl p-3 text-white outline-none focus:border-amber-500`}
                    onChange={(e) => {
                      const cleaned = sanitizeNumeric(e.target.value);
                      setFormData({ ...formData, montant2: cleaned });
                      validateField("montant2", cleaned);
                    }}
                  />
                  {errors.montant2 && (
                    <p className="text-red-500 text-xs mt-1 ml-1">
                      {errors.montant2}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-muted ml-1 text-amber-400">
                  Valeur des frais (Ar)
                </label>
                <div className="relative">
                  <Coins
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500"
                  />
                  <input
                    required
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength="9"
                    value={formData.frais_env}
                    className={`w-full bg-input border ${errors.frais_env ? "border-red-500" : "border-card"} rounded-xl p-3 pl-10 text-amber-400 font-bold text-xl outline-none focus:border-amber-500`}
                    onChange={(e) => {
                      const cleaned = sanitizeNumeric(e.target.value);
                      setFormData({ ...formData, frais_env: cleaned });
                      validateField("frais_env", cleaned);
                    }}
                  />
                  {errors.frais_env && (
                    <p className="text-red-500 text-xs mt-1 ml-1">
                      {errors.frais_env}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  {loading ? (
                    "Chargement..."
                  ) : (
                    <>
                      <Save size={18} />{" "}
                      {isEditMode ? "Mettre à jour" : "Enregistrer le tarif"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modale Suppression */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="bg-card w-full max-w-sm rounded-3xl border border-card shadow-card-lg p-8 text-center animate-in zoom-in duration-200">
            <div className="bg-red-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
              <Trash2 size={40} />
            </div>
            <h2 className="text-xl font-bold text-heading mb-2">
              Supprimer ce tarif ?
            </h2>
            <p className="text-secondary text-sm mb-8">
              Cela pourrait affecter les calculs des prochains transferts.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-element text-white font-bold py-3 rounded-xl"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 text-white font-bold py-3 rounded-xl"
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

export default FraisEnvoiList;
