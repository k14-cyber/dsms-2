
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// These libraries are expected to be installed:
// npm install react-router-dom recharts reactflow @google/genai lucide-react

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
