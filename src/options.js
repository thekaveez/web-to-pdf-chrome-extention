import React from 'react';
import ReactDOM from 'react-dom/client';
import OptionsPage from './components/OptionsPage';
import './index.css';

document.addEventListener('DOMContentLoaded', () => {
  const root = ReactDOM.createRoot(document.getElementById('options-root'));
  root.render(
    <React.StrictMode>
      <OptionsPage />
    </React.StrictMode>
  );
});