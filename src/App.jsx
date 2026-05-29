import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Importation des pages (à créer selon la structure précédente)
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Sidebar from "./pages/Dashboard/Sidebar";
import ClientList from "./pages/Clients/ClientList";
import EnvoiList from "./pages/Operations/EnvoiList";
import RetraitList from "./pages/Operations/RetraitList";
import FraisEnvoiList from "./pages/Operations/FraisEnvoiList";
import FraisRetraitList from "./pages/Operations/FraisRetraitList";
import ReleveClient from "./pages/Operations/ReleveClient";
import GlobalTransactionList from "./pages/Operations/GlobalTransactionList";

// Composant pour protéger les routes (nécessite une authentification)
const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("token"); // Vérification du JWT
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="App">
        <Routes>
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/option"
            element={
              <PrivateRoute>
                <div className="flex justify-between bg-main min-h-screen">
                  <Sidebar />
                  <GlobalTransactionList />
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/releve"
            element={
              <PrivateRoute>
                <div className="flex justify-between bg-main min-h-screen">
                  <Sidebar />
                  <ReleveClient />
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/fraisretrait"
            element={
              <PrivateRoute>
                <div className="flex justify-between bg-main min-h-screen">
                  <Sidebar />
                  <FraisRetraitList />
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/fraisenvoi"
            element={
              <PrivateRoute>
                <div className="flex justify-between bg-main min-h-screen">
                  <Sidebar />
                  <FraisEnvoiList />
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/envois"
            element={
              <PrivateRoute>
                <div className="flex justify-between bg-main min-h-screen">
                  <Sidebar />
                  <EnvoiList />
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/clients"
            element={
              <PrivateRoute>
                <div className="flex justify-between bg-main min-h-screen">
                  <Sidebar />
                  <ClientList />
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/retrait"
            element={
              <PrivateRoute>
                <div className="flex justify-between bg-main min-h-screen">
                  <Sidebar />
                  <RetraitList />
                </div>
              </PrivateRoute>
            }
          />

          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
