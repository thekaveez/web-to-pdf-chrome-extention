import html2pdf from 'html2pdf.js';

export const generatePDF = async (settings) => {
  try {
    // Get current page content
    const element = document.documentElement.cloneNode(true);

    // Apply custom CSS if provided
    if (settings.cssStyles) {
      const styleElement = document.createElement('style');
      styleElement.textContent = settings.cssStyles;
      element.appendChild(styleElement);
    }

    // Hide unwanted elements if needed
    if (!settings.includeImages) {
      const images = element.querySelectorAll('img, svg, canvas');
      images.forEach(img => {
        img.style.display = 'none';
      });
    }

    // Prepare filename
    let filename = settings.filename || '{title}';
    filename = filename
      .replace('{title}', document.title || 'webpage')
      .replace('{url}', window.location.hostname)
      .replace('{date}', new Date().toISOString().split('T')[0])
      .replace('{time}', new Date().toTimeString().split(' ')[0].replace(/:/g, '-'));
    
    if (!filename.endsWith('.pdf')) {
      filename += '.pdf';
    }

    // Configure html2pdf options
    const opt = {
      margin: Number(settings.margin) || 10,
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: false
      },
      jsPDF: { 
        unit: 'mm', 
        format: settings.pageSize || 'a4', 
        orientation: settings.orientation || 'portrait' 
      }
    };

    // Generate PDF with custom header/footer if provided
    if (settings.headerTemplate || settings.footerTemplate) {
      opt.html2canvas.onBeforeRender = function(canvas) {
        const context = canvas.getContext('2d');
        
        if (settings.headerTemplate) {
          const header = settings.headerTemplate
            .replace('{title}', document.title)
            .replace('{url}', window.location.href)
            .replace('{date}', new Date().toLocaleDateString());
          
          context.font = '10pt Arial';
          context.textAlign = 'center';
          context.fillText(header, canvas.width / 2, 20);
        }
      };
    }

    // Keep interactive links if requested
    if (settings.keepLinks) {
      opt.enableLinks = true;
    }

    // Generate PDF
    await html2pdf().set(opt).from(element).save();
    
    return { success: true };
  } catch (error) {
    console.error('PDF generation error:', error);
    return { success: false, error: error.message };
  }
};