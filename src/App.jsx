import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Importation des pages (à créer selon la structure précédente)
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard'
import Sidebar from './pages/Dashboard/Sidebar';
import ClientList from './pages/Clients/ClientList';
import EnvoiList from './pages/Operations/EnvoiList';
import RetraitList from './pages/Operations/RetraitList';
import FraisEnvoiList from './pages/Operations/FraisEnvoiList';
import FraisRetraitList from './pages/Operations/FraisRetraitList';
import ReleveClient from './pages/Operations/ReleveClient';
import GlobalTransactionList from './pages/Operations/GlobalTransactionList';
  
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
          <Route path="/option" element={
            <div className="flex justify-between">
              <Sidebar />
              <GlobalTransactionList />
            </div>
          } />
          <Route path="/releve" element={
            <div className="flex justify-between">
              <Sidebar />
              <ReleveClient />
            </div>
          } />
          <Route path="/fraisretrait" element={
            <div className="flex justify-between">
              <Sidebar />
              <FraisRetraitList />
            </div>
          } />
          <Route path="/fraisenvoi" element={
            <div className="flex justify-between">
              <Sidebar />
              <FraisEnvoiList />
            </div>
          } />
          <Route path="/envois" element={
            <div className="flex justify-between">
              <Sidebar />
              <EnvoiList />
            </div>
          } />
          <Route path="/clients" element={
            <div className="flex justify-between">
              <Sidebar />
              <ClientList />
            </div>
          } />
          <Route path="/retrait" element={
            <div className="flex justify-between">
              <Sidebar />
              <RetraitList />
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