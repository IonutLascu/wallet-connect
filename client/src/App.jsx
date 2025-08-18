import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Settings from './pages/Settings';
import './styles/style.css';

const App = () => {
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/settings" /> : <Login />} 
        />
        <Route 
          path="/settings" 
          element={<Settings />} 
        />
        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;