// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';

// ------------------------------------------------------------------
// FIX: Change the import path to correctly point to the root App.jsx
// assuming your main App.jsx is in the same directory as main.jsx
// ------------------------------------------------------------------
import App from './App.jsx'; // Corrected path (or use a path relative to main.jsx)

import './index.css'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);