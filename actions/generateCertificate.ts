/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { CertificateData } from '@/types/certificate';
import { PDFDocument, rgb, RGB, PDFPage } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import path from 'path';
import { readFileSync } from 'fs';
import { processSummaryData } from '@/utils/certificates';

// Helper functions
const pxToPt = (px: number) => px * 0.75;

const rgbFromHex = (hex: string): RGB => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return rgb(r, g, b);
};

interface ColorWithOpacity {
  color: RGB;
  opacity?: number;
}

export async function generateCertificate(data: CertificateData): Promise<string> {
  try {
    // Create PDF document with custom dimensions
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);
    
    // Load and embed custom Inter font
    const interFontPath = path.join(process.cwd(), 'public/fonts/Inter-Regular.ttf');
    const interBoldPath = path.join(process.cwd(), 'public/fonts/Inter-Bold.ttf');
    const interSemiBoldPath = path.join(process.cwd(), 'public/fonts/Inter-SemiBold.ttf');
    
    const interFontBytes = readFileSync(interFontPath);
    const interBoldBytes = readFileSync(interBoldPath);
    const interSemiBoldBytes = readFileSync(interSemiBoldPath);
    
    const interFont = await pdfDoc.embedFont(interFontBytes);
    const interBold = await pdfDoc.embedFont(interBoldBytes);
    const interSemiBold = await pdfDoc.embedFont(interSemiBoldBytes);

    // Create page with Figma dimensions
    const page = pdfDoc.addPage([pxToPt(1700), pxToPt(1080)]);

    // Define colors
    const colors: Record<string, ColorWithOpacity> = {
      text: { color: rgbFromHex('#1f2128') },
      label: { color: rgbFromHex('#878a94') },
      border: { color: rgbFromHex('#D0D1D6'), opacity: 0.5 },
      white: { color: rgb(1, 1, 1) },
      background: { color: rgb(1, 1, 1), opacity: 0.9 }
    };

    // Draw main container
    const margin = pxToPt(68);
    const innerMargin = pxToPt(40);
    const contentX = margin + innerMargin;

    // Draw header section - Aligned at the top
    const headerY = page.getHeight() - margin - pxToPt(69.5);
    
    // Logo and title side by side
    const logoWidth = pxToPt(220);
    const logoHeight = pxToPt(55);
    
    // Load and draw logo
    const logoPath = path.join(process.cwd(), 'public/assets/logo.png');
    const logoBytes = readFileSync(logoPath);
    const logo = await pdfDoc.embedPng(logoBytes);
    
    page.drawImage(logo, {
      x: page.getWidth() - margin - innerMargin - logoWidth,
      y: headerY - logoHeight,
      width: logoWidth,
      height: logoHeight,
    });

    // Draw title aligned with logo
    page.drawText('Certificate of Carbon Contributions Retirements', {
      x: contentX + pxToPt(80),
      y: headerY - pxToPt(48),
      size: pxToPt(40),
      font: interBold,
      color: colors.text.color,
    });

    // Draw delivery information section
    const deliveryY = headerY - pxToPt(200);
    
    // Column positions
    const leftColumnX = contentX + pxToPt(80);
    const rightColumnX = page.getWidth() - margin - innerMargin - pxToPt(400);
    
    // Define both columns' content
    const leftColumnDetails = [
      { label: 'Delivered to', value: data.deliveredTo || '0x..........' },
      { label: 'Verified Standard', value: data.certifier || 'ERS' },
      { label: 'By', value: data.developer || 'Corcovado Foundation' },
    ];

    const rightColumnDetails = [
      { label: 'Project', value: data.projectName || 'Banegas Farm' },
      { label: 'Based in', value: data.location || 'Costa Rica' },
      { label: 'Project Type', value: data.projectType || 'ARR' },
      { label: 'Project Category', value: data.category || 'Mangrove' },
      { label: 'GPS Location', value: data.gpsLocation || '41.40338, 2.17403' },
    ];

    // Draw left column
    leftColumnDetails.forEach((detail, index) => {
      drawInfoSection(page, {
        x: leftColumnX,
        y: deliveryY - (index * pxToPt(88)),
        label: detail.label,
        value: detail.value,
        font: interFont,
        boldFont: interSemiBold,
        colors,
      });
    });

    // Draw right column
    rightColumnDetails.forEach((detail, index) => {
      drawInfoSection(page, {
        x: rightColumnX,
        y: deliveryY - (index * pxToPt(88)),
        label: detail.label,
        value: detail.value,
        font: interFont,
        boldFont: interSemiBold,
        colors,
        alignment: 'right',
      });
    });

    // Draw summary section - Full width
    const summaryY = deliveryY - pxToPt(480); // Reduced margin before summary
    const summaryWidth = page.getWidth() - (2 * (margin + innerMargin + pxToPt(80))); // Full width minus margins
    const summaryHeight = pxToPt(214);
    
    // Summary title
    page.drawText('Summary', {
      x: leftColumnX,
      y: summaryY + pxToPt(20),
      size: pxToPt(24),
      font: interFont,
      color: colors.text.color,
    });

    // Summary box
    const summaryBoxColor = rgbFromHex('#d0d1d6');
    page.drawRectangle({
      x: leftColumnX,
      y: summaryY - summaryHeight,
      width: summaryWidth,
      height: summaryHeight,
      color: summaryBoxColor,
      opacity: 0.3,
      borderColor: summaryBoxColor,
      borderWidth: 1,
      borderOpacity: 0.5,
    });

    const summaryData = processSummaryData(data.offsettorData, data.vintages, data.decimals);

    const metrics = [
      { 
        label: 'Cumulative Offsetting Amount',
        value: summaryData.offsettingAmount
      },
      {
        label: 'Record date',
        value: summaryData.recordDate
      },
      {
        label: 'Vintages',
        value: summaryData.vintages
      },
      {
        label: 'Serial Number',
        value: summaryData.serialNumber
      }
    ];

    metrics.forEach((metric, index) => {
      const metricY = summaryY - pxToPt(60 + (index * 40));
      
      page.drawText(metric.label, {
        x: leftColumnX + pxToPt(20),
        y: metricY,
        size: pxToPt(24),
        font: interFont,
        color: colors.label.color,
      });

      const valueText = metric.value;
      const valueWidth = interSemiBold.widthOfTextAtSize(valueText, pxToPt(24));
      
      page.drawText(valueText, {
        x: leftColumnX + summaryWidth - valueWidth - pxToPt(40), // Add padding from right edge
        y: metricY,
        size: pxToPt(24),
        font: interSemiBold,
        color: colors.text.color,
      });
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

// Helper function to draw info sections
interface InfoSectionProps {
  x: number;
  y: number;
  label: string;
  value: string;
  font: any;
  boldFont: any;
  colors: Record<string, ColorWithOpacity>;
  alignment?: 'left' | 'right';
  isUnderlined?: boolean;
}

function drawInfoSection(page: PDFPage, props: InfoSectionProps) {
  const { x, y, label, value, font, boldFont, colors, alignment = 'left', isUnderlined = false } = props;
  const fontSize = pxToPt(24);

  // Calculate positions based on alignment
  const labelWidth = font.widthOfTextAtSize(label, fontSize);
  const valueWidth = boldFont.widthOfTextAtSize(value, fontSize);
  
  // Calculate x positions
  const labelX = alignment === 'right' 
    ? x + pxToPt(300) - labelWidth 
    : x;
  
  const valueX = alignment === 'right'
    ? x + pxToPt(300) - valueWidth
    : x;

  // Draw label
  page.drawText(label, {
    x: labelX,
    y,
    size: fontSize,
    font,
    color: colors.label.color,
  });

  // Draw value
  const valueY = y - pxToPt(32);
  page.drawText(value, {
    x: valueX,
    y: valueY,
    size: fontSize,
    font: boldFont,
    color: colors.text.color,
  });

  // Draw underline if needed
  if (isUnderlined) {
    page.drawLine({
      start: { x: valueX, y: valueY - 2 },
      end: { x: valueX + valueWidth, y: valueY - 2 },
      thickness: 1,
      color: colors.text.color,
    });
  }
}
