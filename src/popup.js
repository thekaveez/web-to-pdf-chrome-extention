import React from 'react';
import ReactDOM from 'react-dom/client';
import PopupMenu from './components/PopupMenu';
import './index.css';

document.addEventListener('DOMContentLoaded', () => {
  const root = ReactDOM.createRoot(document.getElementById('popup-root'));
  root.render(
    <React.StrictMode>
      <PopupMenu />
    </React.StrictMode>
  );
});