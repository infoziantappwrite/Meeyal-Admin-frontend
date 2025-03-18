// Install react-router-dom before using this setup
// npm install react-router-dom

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRoute as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import Login from './pages/Login.jsx';
import { UserProvider } from './lib/UserContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <UserProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/*" element={<App />} />
      </Routes>
    </Router>
    </UserProvider>
  </StrictMode>
);
