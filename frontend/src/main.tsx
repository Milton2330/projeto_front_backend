// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
// 1. Importe o BrowserRouter
import { BrowserRouter } from "react-router-dom";
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 2. Envolva o <App /> com o <BrowserRouter> */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)