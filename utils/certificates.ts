import { OffsetData, Vintage } from "@/types/projects";

interface SummaryData {
  offsettingAmount: string;
  recordDate: string;
  vintages: string;
  serialNumber: string;
}

// Calculate total offsetting amount from offset data
function calculateOffsettingAmount(offsetData: OffsetData[], decimals: number): string {
  if (!decimals) return '0';
  const total = offsetData.reduce((sum, data) => sum + Number(data.amount), 0);
  return (total * Math.pow(10, -decimals)).toFixed(6);
}

// Format date to yyyy-mm-dd
function formatRecordDate(): string {
  const date = new Date();
  return date.toISOString().split('T')[0];
}

// Process vintage years into a formatted string
function formatVintageYears(vintages: Vintage[]): string {
  if (!vintages.length) return '';

  // Extract and sort years
  const years = [...new Set(vintages.map(v => Number(v.year)))].sort((a, b) => a - b);
  
  if (years.length <= 4) {
    return years.join(', ');
  }

  // Find ranges in the sorted years
  const ranges: [number, number][] = [];
  let rangeStart = years[0];
  let prev = years[0];

  for (let i = 1; i <= years.length; i++) {
    const current = years[i];
    if (current !== prev + 1 || i === years.length) {
      ranges.push([rangeStart, prev]);
      rangeStart = current;
    }
    prev = current;
  }

  // Format ranges into string
  return ranges
    .map(([start, end]) => start === end ? start.toString() : `${start} to ${end}`)
    .join(', ');
}

// Generate a unique serial number
function generateSerialNumber(projectAddress: string): string {
  const timestamp = Date.now().toString(36);
  const projectId = projectAddress.slice(-8);
  const random = Math.random().toString(36).slice(2, 6);
  
  return `CARB-${timestamp}-${projectId}-${random}`.toUpperCase();
}

// Main function to process summary data
export function processSummaryData(offsetData: OffsetData[] | undefined, vintages: Vintage[] | undefined, decimals: number | undefined): SummaryData {
  if (!offsetData || !vintages || !decimals) {
    return {
      offsettingAmount: '0 T CO₂',
      recordDate: formatRecordDate(),
      vintages: '',
      serialNumber: generateSerialNumber('0'),
    };
  }

  return {
    offsettingAmount: `${calculateOffsettingAmount(offsetData, decimals)} T CO₂`,
    recordDate: formatRecordDate(),
    vintages: formatVintageYears(vintages),
    serialNumber: generateSerialNumber(offsetData[0]?.project_address.toString() || '0'),
  };
}