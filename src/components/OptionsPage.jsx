import React, { useState, useEffect } from 'react';
import '../index.css';

const OptionsPage = () => {
  const [settings, setSettings] = useState({
    includeImages: true,
    keepLinks: true,
    pageSize: 'A4',
    orientation: 'portrait',
    filename: '{title}',
    margin: 10,
    headerTemplate: '',
    footerTemplate: 'Page {pageNumber} of {totalPages}',
    cssStyles: '',
    autoSaveEnabled: false,
    autoSaveRules: []
  });
  
  const [saved, setSaved] = useState(false);
  
  useEffect(() => {
    // Load settings from storage
    chrome.storage.sync.get(['pdfSettings'], (result) => {
      if (result.pdfSettings) {
        setSettings({...settings, ...result.pdfSettings});
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
  };
  
  const saveSettings = () => {
    chrome.storage.sync.set({
      pdfSettings: settings
    }, () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  };
  
  const addAutoSaveRule = () => {
    const newRule = {
      id: Date.now(),
      urlPattern: '',
      frequency: 'daily'
    };
    
    setSettings({
      ...settings,
      autoSaveRules: [...settings.autoSaveRules, newRule]
    });
  };
  
  const updateRule = (id, field, value) => {
    const updatedRules = settings.autoSaveRules.map(rule => {
      if (rule.id === id) {
        return { ...rule, [field]: value };
      }
      return rule;
    });
    
    setSettings({
      ...settings,
      autoSaveRules: updatedRules
    });
  };
  
  const removeRule = (id) => {
    const updatedRules = settings.autoSaveRules.filter(rule => rule.id !== id);
    
    setSettings({
      ...settings,
      autoSaveRules: updatedRules
    });
  };
  
  return (
    <div className="options-container">
      <h1>Save Webpage as PDF - Advanced Options</h1>
      
      <div className="section">
        <h2>PDF Settings</h2>
        
        <div className="form-group">
          <label>Filename Template:</label>
          <input
            type="text"
            name="filename"
            value={settings.filename}
            onChange={handleSettingChange}
          />
          <small>Available variables: {'{title}'}, {'{url}'}, {'{date}'}, {'{time}'}</small>
        </div>
        
        <div className="form-group">
          <label>Page Margin (mm):</label>
          <input
            type="number"
            name="margin"
            value={settings.margin}
            onChange={handleSettingChange}
          />
        </div>
        
        <div className="form-group">
          <label>Header Template:</label>
          <input
            type="text"
            name="headerTemplate"
            value={settings.headerTemplate}
            onChange={handleSettingChange}
          />
        </div>
        
        <div className="form-group">
          <label>Footer Template:</label>
          <input
            type="text"
            name="footerTemplate"
            value={settings.footerTemplate}
            onChange={handleSettingChange}
          />
        </div>
        
        <div className="form-group">
          <label>Custom CSS:</label>
          <textarea
            name="cssStyles"
            value={settings.cssStyles}
            onChange={handleSettingChange}
            rows="4"
          />
        </div>
      </div>
      
      <div className="section">
        <h2>Auto-Save Rules</h2>
        
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="autoSaveEnabled"
              checked={settings.autoSaveEnabled}
              onChange={handleSettingChange}
            />
            Enable Auto-Save for Specific URLs
          </label>
        </div>
        
        {settings.autoSaveEnabled && (
          <div className="auto-save-rules">
            {settings.autoSaveRules.map(rule => (
              <div key={rule.id} className="rule">
                <input
                  type="text"
                  value={rule.urlPattern}
                  onChange={(e) => updateRule(rule.id, 'urlPattern', e.target.value)}
                  placeholder="URL pattern (e.g. *.example.com/*)"
                />
                
                <select
                  value={rule.frequency}
                  onChange={(e) => updateRule(rule.id, 'frequency', e.target.value)}
                >
                  <option>Once</option>
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
                
                <button 
                  onClick={() => removeRule(rule.id)}
                  className="remove-button"
                >
                  Remove
                </button>
              </div>
            ))}
            
            <button 
              onClick={addAutoSaveRule}
              className="add-button"
            >
              Add Rule
            </button>
          </div>
        )}
      </div>
      
      <div className="actions">
        <button
          onClick={saveSettings}
          className="save-button"
        >
          Save Settings
        </button>
        
        {saved && <div className="save-confirmation">Settings saved!</div>}
      </div>
    </div>
  );
};

export default OptionsPage;