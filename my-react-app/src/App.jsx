import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DonorDashboard from './pages/DonorDashboard';
import NgoDashboard from './pages/NgoDashboard';
import DeliveryDashboard from './pages/DeliveryDashboard';

export default function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userType, userData) => {
    setUser({ type: userType, ...userData });
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={!user ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/dashboard"
          element={
            user ? (
              user.type === 'donor' ? (
                <DonorDashboard user={user} onLogout={handleLogout} />
              ) : user.type === 'ngo' ? (
                <NgoDashboard user={user} onLogout={handleLogout} />
              ) : (
                <DeliveryDashboard user={user} onLogout={handleLogout} />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}
