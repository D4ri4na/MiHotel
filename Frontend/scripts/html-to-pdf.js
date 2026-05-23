const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function convertHtmlToPdf() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  const htmlPath = path.join(__dirname, '../jest_html_reporters.html');
  const pdfPath = path.join(__dirname, '../coverage/coverage-report.pdf');
  
  // Abrir el archivo HTML
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
  
  // Generar PDF
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    margin: {
      top: '20px',
      right: '20px',
      bottom: '20px',
      left: '20px'
    }
  });
  
  await browser.close();
  
  console.log(`✅ PDF generado en: ${pdfPath}`);
}

convertHtmlToPdf().catch(err => {
  console.error('❌ Error generando PDF:', err);
  process.exit(1);
});
