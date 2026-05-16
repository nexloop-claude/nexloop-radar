import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Captures a DOM element and downloads it as an A4 PDF.
 * @param {string} elementId - id of the element to capture
 * @param {string} filename  - output filename (without .pdf)
 * @param {function} onProgress - called with 0..100 progress
 */
export async function generatePDF(elementId, filename, onProgress) {
  const element = document.getElementById(elementId);
  if (!element) throw new Error(`Element #${elementId} not found`);

  onProgress?.(5);

  // Temporarily force a fixed width so the PDF is consistent regardless of screen size
  const originalWidth = element.style.width;
  const originalMaxWidth = element.style.maxWidth;
  element.style.width = '860px';
  element.style.maxWidth = '860px';

  let canvas;
  try {
    canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: 860,
    });
  } finally {
    element.style.width = originalWidth;
    element.style.maxWidth = originalMaxWidth;
  }

  onProgress?.(70);

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = pdf.internal.pageSize.getWidth();   // 210
  const pageH = pdf.internal.pageSize.getHeight();  // 297
  const margin = 0; // full-bleed — the report already has its own padding

  const imgW = pageW - 2 * margin;
  const imgH = (canvas.height / canvas.width) * imgW;

  const imgData = canvas.toDataURL('image/jpeg', 0.93);

  onProgress?.(80);

  // Slice image across pages
  let rendered = 0;
  let page = 0;
  while (rendered < imgH) {
    if (page > 0) pdf.addPage();
    pdf.addImage(imgData, 'JPEG', margin, margin - rendered, imgW, imgH);
    rendered += pageH - 2 * margin;
    page++;
  }

  onProgress?.(95);
  pdf.save(`${filename}.pdf`);
  onProgress?.(100);
}

/** Builds a canonical filename for a report */
export function reportFilename(companyInfo) {
  const company = (companyInfo.company || 'assessment')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  const date = new Date().toISOString().slice(0, 10);
  return `nexloop-radar-${company}-${date}`;
}
