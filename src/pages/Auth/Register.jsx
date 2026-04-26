import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UserPlus, User, Lock, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast'; // Importation de toast

const Register = () => {
  const [user, setUser] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:8080/api/auth/register', user);
      
      // Design de notification Succès
      toast.success('Compte administrateur créé avec succès !', {
        style: {
          border: '1px solid #10B981',
          padding: '16px',
          color: '#065F46',
        },
        iconTheme: {
          primary: '#10B981',
          secondary: '#FFFAEE',
        },
      });
      
      navigate('/login');
    } catch (err) {
      // Design de notification Erreur
      toast.error("Échec de l'inscription. L'utilisateur existe déjà.", {
        style: {
          border: '1px solid #EF4444',
          padding: '16px',
          color: '#991B1B',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        
        {/* Header avec dégradé */}
        <div className="bg-linear-to-r from-green-600 to-emerald-500 p-8 text-center text-white">
          <div className="bg-white/20 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <UserPlus className="text-white" size={40} />
          </div>
          <h2 className="text-3xl font-extrabold">Inscription</h2>
          <p className="text-green-100 mt-2">Créez un nouvel accès administrateur</p>
        </div>

        <div className="p-8">
          <Link to="/login" className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-700 mb-6 transition-colors">
            <ArrowLeft size={16} className="mr-2" /> Retour à la connexion
          </Link>

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Identifiant</label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 group-focus-within:text-green-500 transition-colors">
                  <User size={20} />
                </span>
                <input
                  type="text"
                  required
                  className="block w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all text-gray-700"
                  placeholder="Nom d'utilisateur"
                  onChange={(e) => setUser({...user, username: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Mot de passe</label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 group-focus-within:text-green-500 transition-colors">
                  <Lock size={20} />
                </span>
                <input
                  type="password"
                  required
                  className="block w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all text-gray-700"
                  placeholder="••••••••"
                  onChange={(e) => setUser({...user, password: e.target.value})}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-white shadow-lg shadow-green-200 transition-all transform active:scale-[0.98] ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700 hover:-translate-y-0.5'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Traitement...
                </span>
              ) : 'Finaliser l\'inscription'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;