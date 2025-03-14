import React, { useState, useEffect } from 'react';
import '../index.css';

const PopupMenu = () => {
  const [settings, setSettings] = useState({
    includeImages: true,
    keepLinks: true,
    pageSize: 'A4',
    orientation: 'portrait',
  });
  
  const [isConverting, setIsConverting] = useState(false);
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    // Load settings from storage
    chrome.storage.sync.get(['pdfSettings'], (result) => {
      if (result.pdfSettings) {
        setSettings(result.pdfSettings);
      }
    });
  }, []);
  
  const handleSettingChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setSettings({
      ...settings,
      [name]: newValue
    });
    
    // Save to storage
    chrome.storage.sync.set({
      pdfSettings: {
        ...settings,
        [name]: newValue
      }
    });
  };
  
  const saveToPDF = () => {
    setIsConverting(true);
    setMessage('Converting page to PDF...');
    
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: 'saveToPDF', settings: settings },
        (response) => {
          if (response && response.success) {
            setMessage('PDF saved successfully!');
          } else {
            setMessage('Error: ' + (response?.error || 'Failed to convert page'));
          }
          setIsConverting(false);
        }
      );
    });
  };
  
  const openOptions = () => {
    chrome.runtime.openOptionsPage();
  };
  
  return (
    <div className="popup-container">
      <h2>Save Webpage as PDF</h2>
      
      <div className="setting">
        <label>
          <input
            type="checkbox"
            name="includeImages"
            checked={settings.includeImages}
            onChange={handleSettingChange}
          />
          Include Images
        </label>
      </div>
      
      <div className="setting">
        <label>
          <input
            type="checkbox"
            name="keepLinks"
            checked={settings.keepLinks}
            onChange={handleSettingChange}
          />
          Keep Hyperlinks
        </label>
      </div>
      
      <div className="setting">
        <label>Page Size:</label>
        <select name="pageSize" value={settings.pageSize} onChange={handleSettingChange}>
          <option value="A4">A4</option>
          <option value="Letter">Letter</option>
          <option value="Legal">Legal</option>
        </select>
      </div>
      
      <div className="setting">
        <label>Orientation:</label>
        <select name="orientation" value={settings.orientation} onChange={handleSettingChange}>
          <option value="portrait">Portrait</option>
          <option value="landscape">Landscape</option>
        </select>
      </div>
      
      <div className="actions">
        <button onClick={saveToPDF} disabled={isConverting}>
          {isConverting ? 'Converting...' : 'Save as PDF'}
        </button>
        <button onClick={openOptions}>
          Advanced Options
        </button>
      </div>
      
      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default PopupMenu;