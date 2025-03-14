export const saveToStorage = (key, value) => {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.set({ [key]: value }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  };
  
  export const getFromStorage = (key) => {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get([key], (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(result[key]);
        }
      });
    });
  };
  
  // Handle auto-save rules
  export const checkAutoSaveRules = async (url) => {
    try {
      const settings = await getFromStorage('pdfSettings');
      
      if (!settings || !settings.autoSaveEnabled || !settings.autoSaveRules) {
        return false;
      }
      
      // Check if URL matches any rule
      for (const rule of settings.autoSaveRules) {
        if (matchUrlPattern(url, rule.urlPattern)) {
          // Check if we should save based on frequency
          const lastSaved = await getFromStorage(`lastSaved_${rule.id}`);
          
          if (shouldSaveBasedOnFrequency(lastSaved, rule.frequency)) {
            // Mark as saved
            await saveToStorage(`lastSaved_${rule.id}`, Date.now());
            return true;
          }
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error checking auto-save rules:', error);
      return false;
    }
  };
  
  // Helper function to match URL patterns
  const matchUrlPattern = (url, pattern) => {
    // Convert pattern to regex
    const regexPattern = pattern
      .replace(/\./g, '\\.')
      .replace(/\*/g, '.*');
    
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(url);
  };
  
  // Check if we should save based on frequency
  const shouldSaveBasedOnFrequency = (lastSaved, frequency) => {
    if (!lastSaved) {
      return true; // Never saved before
    }
    
    const now = Date.now();
    const timeSinceLastSave = now - lastSaved;
    
    switch (frequency) {
      case 'once':
        return false; // Already saved once
      case 'daily':
        return timeSinceLastSave >= 24 * 60 * 60 * 1000;
      case 'weekly':
        return timeSinceLastSave >= 7 * 24 * 60 * 60 * 1000;
      case 'monthly':
        return timeSinceLastSave >= 30 * 24 * 60 * 60 * 1000;
      default:
        return true;
    }
  };