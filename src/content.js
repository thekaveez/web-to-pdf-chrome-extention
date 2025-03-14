import { generatePDF } from './utils/pdfGenerator';
import { checkAutoSaveRules } from './utils/storage';

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'saveToPDF') {
    generatePDF(message.settings)
      .then(result => {
        sendResponse(result);
      })
      .catch(error => {
        sendResponse({ success: false, error: error.message });
      });
    
    return true; // Indicates that sendResponse will be called asynchronously
  }
});

// Check for auto-save rules when the page loads completely
window.addEventListener('load', async () => {
  try {
    const shouldAutoSave = await checkAutoSaveRules(window.location.href);
    
    if (shouldAutoSave) {
      // Get settings from storage
      chrome.storage.sync.get(['pdfSettings'], async (result) => {
        if (result.pdfSettings) {
          await generatePDF(result.pdfSettings);
        }
      });
    }
  } catch (error) {
    console.error('Auto-save error:', error);
  }
});