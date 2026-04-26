import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Importation des pages (à créer selon la structure précédente)
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard'
import Sidebar from './pages/Dashboard/Sidebar';
import ClientList from './pages/Clients/ClientList';

// Composant pour protéger les routes (nécessite une authentification)
const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token'); // Vérification du JWT
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="App">
        <Routes>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/clients" element={
            <div className="flex justify-between">
              <Sidebar />
              <ClientList />
            </div>
          } />
          
          <Route path="/register" element={<Register/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;