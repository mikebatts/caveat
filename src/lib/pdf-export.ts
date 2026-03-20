import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';

export async function exportReportAsPDF(elementId: string, filename: string): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) throw new Error('Report element not found');

  // Add class to hide interactive elements
  document.body.classList.add('pdf-capturing');

  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#0a0a0f',
      scale: 2,
      useCORS: true,
      logging: false,
      windowWidth: 800,
    });

    const imgWidth = 190; // mm (A4 minus margins)
    const pageHeight = 277; // mm (A4 minus margins)
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const pdf = new jsPDF('p', 'mm', 'a4');
    let heightLeft = imgHeight;
    let position = 10; // top margin
    const imgData = canvas.toDataURL('image/png');

    // First page
    pdf.setFillColor(10, 10, 15);
    pdf.rect(0, 0, 210, 297, 'F');

    // Branding header
    pdf.setFontSize(8);
    pdf.setTextColor(124, 58, 237);
    pdf.text('CAVEAT', 10, 7);
    pdf.setTextColor(161, 161, 170);
    pdf.text('AI Contract Intelligence Report', 30, 7);

    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    heightLeft -= (pageHeight - position);

    // Additional pages
    while (heightLeft > 0) {
      pdf.addPage();
      pdf.setFillColor(10, 10, 15);
      pdf.rect(0, 0, 210, 297, 'F');

      // Header on each page
      pdf.setFontSize(8);
      pdf.setTextColor(124, 58, 237);
      pdf.text('CAVEAT', 10, 7);
      pdf.setTextColor(161, 161, 170);
      pdf.text('AI Contract Intelligence Report', 30, 7);

      position = position - pageHeight;
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Disclaimer footer on last page
    const lastPage = pdf.getNumberOfPages();
    pdf.setPage(lastPage);
    pdf.setFontSize(6);
    pdf.setTextColor(113, 113, 122);
    pdf.text(
      'AI-generated analysis only. Not legal advice. Not a security audit. Consult appropriate professionals.',
      105,
      290,
      { align: 'center' }
    );

    pdf.save(filename);
  } finally {
    document.body.classList.remove('pdf-capturing');
  }
}
