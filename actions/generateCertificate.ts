'use server'

import { CertificateData } from '@/types/certificate';
import { PDFDocument, StandardFonts } from 'pdf-lib';

export async function generateCertificate(data: CertificateData): Promise<string> {
  try {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    
    // Add content to the PDF
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    page.setFont(font);
    
    // Add your content here
    page.drawText(data.title, {
      x: 50,
      y: page.getHeight() - 50,
      size: 20,
    });
    
    // Generate PDF bytes
    const pdfBytes = await pdfDoc.save();
    
    // Convert to base64 for transmission
    const buffer = Buffer.from(pdfBytes);
    return buffer.toString('base64');
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw new Error('Failed to generate PDF');
  }
}