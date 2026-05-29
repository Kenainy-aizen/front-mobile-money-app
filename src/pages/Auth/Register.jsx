import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { User, Lock, UserPlus, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

const Register = () => {
  const [user, setUser] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:8080/api/auth/register", user);

      toast.success("Compte administrateur créé avec succès !", {
        style: {
          border: "1px solid #3B82F6",
          padding: "16px",
          color: "#1E40AF",
        },
        iconTheme: {
          primary: "#3B82F6",
          secondary: "#FFFAEE",
        },
      });

      navigate("/login");
    } catch (err) {
      toast.error("Échec de l'inscription. L'utilisateur existe déjà.", {
        style: {
          border: "1px solid #EF4444",
          padding: "16px",
          color: "#991B1B",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-main flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* En-tête */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4">
            <img src="/favicon.svg" alt="M-Money Pro" className="w-16 h-16" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">M-Money Pro</h2>
          <p className="text-gray-500 mt-2">Créez un compte administrateur</p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom d'utilisateur
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <User size={18} />
              </span>
              <input
                type="text"
                required
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm outline-none transition-all"
                placeholder="Ex: Administrateur"
                onChange={(e) => setUser({ ...user, username: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <Lock size={18} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                required
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm outline-none transition-all"
                placeholder="••••••••"
                onChange={(e) => setUser({ ...user, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Traitement...
              </span>
            ) : (
              <>
                <UserPlus size={18} />
                Créer mon compte
              </>
            )}
          </button>
        </form>

        {/* Pied de formulaire */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm">
          <p className="text-gray-600">
            Déjà un compte ?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
