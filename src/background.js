// Simple version of background.js
// Don't use import statements in service workers with MV3
const defaultSettings = {
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
};

// Handle installation
chrome.runtime.onInstalled.addListener(() => {
  // Set default settings
  chrome.storage.sync.set({ pdfSettings: defaultSettings });
  
  // Create context menu
  chrome.contextMenus.create({
    id: 'saveToPDF',
    title: 'Save page as PDF',
    contexts: ['page']
  });
});

// Context menu handler
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'saveToPDF') {
    chrome.storage.sync.get(['pdfSettings'], (result) => {
      if (result.pdfSettings) {
        chrome.tabs.sendMessage(
          tab.id,
          { action: 'saveToPDF', settings: result.pdfSettings }
        );
      }
    });
  }
});

// Add a console log to verify service worker is running
console.log('PDF Saver service worker initialized');