// lib/certificate-generator.ts
'use server'

import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import path from 'path';
import { readFileSync } from 'fs';
import { processSummaryData } from '@/utils/certificates';
import { CertificateData } from '@/types/certificate';
import { Colors, DetailColumn, PageDimensions, SummaryMetric } from './certificates/certificates-types';
import { addTablePages, drawInfoSection, pxToPt, rgbFromHex } from './certificates/certificates-helper';

export async function generateCertificate(data: CertificateData, chain: string): Promise<string> {
  try {
    // Create PDF document
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);
    
    // Load fonts
    const interFontPath = path.join(process.cwd(), 'public/fonts/Inter-Regular.ttf');
    const interBoldPath = path.join(process.cwd(), 'public/fonts/Inter-Bold.ttf');
    const interSemiBoldPath = path.join(process.cwd(), 'public/fonts/Inter-SemiBold.ttf');
    
    const [interFontBytes, interBoldBytes, interSemiBoldBytes] = [
      interFontPath,
      interBoldPath,
      interSemiBoldPath
    ].map(fontPath => readFileSync(fontPath));
    
    const interFont = await pdfDoc.embedFont(interFontBytes);
    const interBold = await pdfDoc.embedFont(interBoldBytes);
    const interSemiBold = await pdfDoc.embedFont(interSemiBoldBytes);

    // Define dimensions
    const dimensions: PageDimensions = {
      width: pxToPt(1700),
      height: pxToPt(1080)
    };

    // Create first page
    const page = pdfDoc.addPage([dimensions.width, dimensions.height]);

    // Define colors
    const colors: Colors = {
      text: { color: rgbFromHex('#1f2128') },
      label: { color: rgbFromHex('#878a94') },
      border: { color: rgbFromHex('#D0D1D6'), opacity: 0.5 },
      white: { color: rgb(1, 1, 1) },
      background: { color: rgb(1, 1, 1), opacity: 0.9 },
      link: { color: rgbFromHex('#0066cc') }
    };

    // Layout constants
    const margin = pxToPt(68);
    const innerMargin = pxToPt(40);
    const contentX = margin + innerMargin;
    const headerY = page.getHeight() - margin - pxToPt(69.5);
    
    // Logo dimensions and positioning
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

    // Draw title
    page.drawText('Certificate of Carbon Contributions Retirements', {
      x: contentX + pxToPt(80),
      y: headerY - pxToPt(48),
      size: pxToPt(40),
      font: interBold,
      color: colors.text.color,
    });

    // Information columns setup
    const deliveryY = headerY - pxToPt(200);
    const leftColumnX = contentX + pxToPt(80);
    const rightColumnX = page.getWidth() - margin - innerMargin - pxToPt(400);
    
    // Define columns content
    const leftColumnDetails: DetailColumn[] = [
      { label: 'Delivered to', value: data.deliveredTo || '0x..........' },
      { label: 'Verified Standard', value: data.certifier || 'ERS' },
      { label: 'By', value: data.developer || 'Corcovado Foundation' },
    ];

    const rightColumnDetails: DetailColumn[] = [
      { label: 'Project', value: data.projectName || 'Banegas Farm' },
      { label: 'Based in', value: data.location || 'Costa Rica' },
      { label: 'Project Type', value: data.projectType || 'ARR' },
      { label: 'Project Category', value: data.category || 'Mangrove' },
      { label: 'GPS Location', value: data.gpsLocation || '41.40338, 2.17403' },
    ];

    // Draw columns
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

    // Summary section
    const summaryY = deliveryY - pxToPt(480);
    const summaryWidth = page.getWidth() - (2 * (margin + innerMargin + pxToPt(80)));
    const summaryHeight = pxToPt(214);
    
    // Draw summary title
    page.drawText('Summary', {
      x: leftColumnX,
      y: summaryY + pxToPt(20),
      size: pxToPt(24),
      font: interFont,
      color: colors.text.color,
    });

    // Draw summary box
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

    // Process and draw summary data
    const summaryData = processSummaryData(data.offsettorData, data.vintages, data.decimals);

    const metrics: SummaryMetric[] = [
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
        x: leftColumnX + summaryWidth - valueWidth - pxToPt(40),
        y: metricY,
        size: pxToPt(24),
        font: interSemiBold,
        color: colors.text.color,
      });
    });

    // Add table pages if there's offset data
    if (data.offsettorData && data.offsettorData.length > 0) {
      await addTablePages(pdfDoc, data.offsettorData, {
        pageWidth: dimensions.width,
        pageHeight: dimensions.height,
        margin,
        innerMargin,
        colors,
        interFont,
        interBold,
        interSemiBold,
        logo,
        chain,
        vintages: data.vintages || [],
        decimals: data.decimals || 1,
      });
    }

    // Generate and return PDF
    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes).toString('base64');
    
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw new Error('Failed to generate PDF');
  }
}