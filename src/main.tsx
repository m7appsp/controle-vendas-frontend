import './index.css'
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { VendasProvider } from './context/VendasContext';

ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
).render(
  <React.StrictMode>
    <VendasProvider>
      <App />
    </VendasProvider>
  </React.StrictMode>
);