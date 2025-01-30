// utils/pdf-utils.ts
import { rgb, RGB, PDFPage, PDFDocument } from 'pdf-lib';
import { OffsetData, Vintage } from '@/types/projects';
import { FormattedTableRow, InfoSectionProps, TablePageConfig } from './certificates-types';
import { num } from 'starknet';

// Helper functions
export const pxToPt = (px: number) => px * 0.75;

export const rgbFromHex = (hex: string): RGB => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return rgb(r, g, b);
};

export function getVoyagerUrl(txHash: string, chain: string): string {
  const baseUrl = chain === 'Starknet Sepolia Testnet' 
    ? 'sepolia.voyager.online' 
    : 'voyager.online';
  return `https://${baseUrl}/tx/${txHash}`;
}

export function getVintageYear(vintageIndex: bigint, vintages: Vintage[]): string {
  if (!vintages || vintages.length === 0) return String(vintageIndex);
  
  // Sort vintages by year to find the base year
  const sortedVintages = [...vintages].sort((a, b) => 
    Number(a.year - b.year)
  );
  
  const baseYear = Number(sortedVintages[0].year);
  const index = Number(vintageIndex);
  
  // Vintage index starts at 1, so subtract 1 for calculation
  return String(baseYear + (index - 1));
}

export function formatDecimalValue(value: bigint, decimals: number): string {
  if (decimals === 0) return value.toString();

  const divisor = BigInt(10 ** decimals);
  const integerPart = value / divisor;
  const decimalPart = value % divisor;
  
  if (decimalPart === 0n) {
    return integerPart.toString();
  }

  // Convert to string and pad with zeros
  const decimalStr = decimalPart.toString().padStart(decimals, '0');
  
  // Process each digit to handle rounding
  let shouldRound = false;
  const digits = decimalStr.split('');
  
  // Check if we need to round up (if any remaining digits are non-zero)
  for (let i = digits.length - 1; i >= 0; i--) {
    if (parseInt(digits[i]) > 0) {
      shouldRound = true;
      break;
    }
  }
  
  if (shouldRound) {
    let carry = 1;
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i]) + carry;
      if (digit === 10) {
        digit = 0;
        carry = 1;
      } else {
        carry = 0;
      }
      digits[i] = digit.toString();
    }
    if (carry === 1) {
      return (integerPart + 1n).toString();
    }
  }
  
  // Remove trailing zeros
  const finalDecimal = digits.join('').replace(/0+$/, '');
  
  return finalDecimal 
    ? `${integerPart}.${finalDecimal}`
    : integerPart.toString();
}

export function drawInfoSection(page: PDFPage, props: InfoSectionProps) {
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

export function formatTableData(
  offsettorData: OffsetData[], 
  vintages: Vintage[], 
  decimals: number
): FormattedTableRow[] {
  return offsettorData.map(row => ({
    vintage: getVintageYear(row.vintage, vintages),
    amount: formatDecimalValue(row.amount, decimals),
    filled: formatDecimalValue(row.filled, decimals),
    tx_hash: String(row.tx_hash)
  }));
}

export function formatTransactionHash(txHash: string | bigint): string {
  // If txHash is already a string, verify it's a valid hex
  if (typeof txHash === 'string') {
    // Check if it's already a valid hex string
    if (txHash.startsWith('0x')) {
      return txHash;
    }
    // Try to convert from decimal string to hex
    try {
      return num.toHex(BigInt(txHash));
    } catch {
      return txHash; // Return as is if conversion fails
    }
  }
  
  // Convert bigint to hex
  return num.toHex(txHash);
}

export async function addTablePages(
  pdfDoc: PDFDocument,
  offsettorData: OffsetData[],
  config: TablePageConfig
) {
  const {
    pageWidth,
    pageHeight,
    margin,
    innerMargin,
    colors,
    interFont,
    interBold,
    logo,
    vintages,
    decimals
  } = config;

  // Constants for table layout
  const rowHeight = pxToPt(50);
  const headerHeight = pxToPt(60);
  const logoHeight = pxToPt(55);
  const titleMargin = pxToPt(80);
  const contentX = margin + innerMargin;
  
  // Calculate available height for table rows on each page
  const tableStartY = pageHeight - margin - logoHeight - titleMargin - headerHeight;
  const maxRowsPerPage = Math.floor((tableStartY - margin) / rowHeight);

  // Calculate number of pages needed
  const totalPages = Math.ceil(offsettorData.length / maxRowsPerPage);

  // Column definitions with adjusted widths for full tx hash
  const columns = [
    { header: 'Vintage', key: 'vintage', width: pxToPt(150) },
    { header: 'Amount', key: 'amount', width: pxToPt(200) },
    { header: 'Filled', key: 'filled', width: pxToPt(200) },
    { header: 'Transaction Hash', key: 'tx_hash', width: pxToPt(550) },
  ];

  // Create pages and draw tables
  for (let pageNum = 0; pageNum < totalPages; pageNum++) {
    const page = pdfDoc.addPage([pageWidth, pageHeight]);
    const startIndex = pageNum * maxRowsPerPage;
    const endIndex = Math.min((pageNum + 1) * maxRowsPerPage, offsettorData.length);

    // Format the data for this page
    const formattedData = formatTableData(
      offsettorData.slice(startIndex, endIndex),
      vintages,
      decimals
    );

    // Draw logo
    const logoWidth = pxToPt(220);
    page.drawImage(logo, {
      x: pageWidth - margin - innerMargin - logoWidth,
      y: pageHeight - margin - logoHeight,
      width: logoWidth,
      height: logoHeight,
    });

    // Draw page title
    page.drawText('Carbon Contributions Retirement Records', {
      x: contentX + titleMargin,
      y: pageHeight - margin - pxToPt(48),
      size: pxToPt(40),
      font: interBold,
      color: colors.text.color,
    });

    // Draw table header
    let currentX = contentX + titleMargin;
    columns.forEach(column => {
      page.drawText(column.header, {
        x: currentX,
        y: tableStartY,
        size: pxToPt(20),
        font: interBold,
        color: colors.text.color,
      });
      currentX += column.width;
    });

    // Draw table rows
    formattedData.forEach((row, index) => {
      const rowY = tableStartY - ((index + 1) * rowHeight);
      currentX = contentX + titleMargin;

      // Draw cell values
      columns.forEach(column => {
        const value = column.key === 'tx_hash' 
          ? formatTransactionHash(row[column.key])
          : row[column.key as keyof FormattedTableRow];

        page.drawText(value, {
          x: currentX,
          y: rowY,
          size: pxToPt(16),
          font: interFont,
          color: colors.text.color,
        });
        
        currentX += column.width;
      });

      // Draw row separator
      page.drawLine({
        start: { x: contentX + titleMargin, y: rowY - pxToPt(10) },
        end: { x: pageWidth - margin - innerMargin, y: rowY - pxToPt(10) },
        thickness: 1,
        color: colors.border.color,
        opacity: colors.border.opacity,
      });
    });

    // Draw page number if there are multiple pages
    if (totalPages > 1) {
      const pageText = `Page ${pageNum + 1} of ${totalPages}`;
      const textWidth = interFont.widthOfTextAtSize(pageText, pxToPt(14));
      page.drawText(pageText, {
        x: pageWidth - margin - innerMargin - textWidth,
        y: margin,
        size: pxToPt(14),
        font: interFont,
        color: colors.text.color,
      });
    }
  }
}