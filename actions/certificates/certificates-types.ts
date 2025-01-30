// types/pdf.ts
import { Vintage } from '@/types/projects';
import { PDFFont, PDFImage, RGB } from 'pdf-lib';

export interface ColorWithOpacity {
  color: RGB;
  opacity?: number;
}

export interface Colors {
  text: ColorWithOpacity;
  label: ColorWithOpacity;
  border: ColorWithOpacity;
  white: ColorWithOpacity;
  background: ColorWithOpacity;
  link: ColorWithOpacity;
}

export interface InfoSectionProps {
  x: number;
  y: number;
  label: string;
  value: string;
  font: PDFFont;
  boldFont: PDFFont;
  colors: Colors;
  alignment?: 'left' | 'right';
  isUnderlined?: boolean;
}

export interface TablePageConfig {
  pageWidth: number;
  pageHeight: number;
  margin: number;
  innerMargin: number;
  colors: Colors;
  interFont: PDFFont;
  interBold: PDFFont;
  interSemiBold: PDFFont;
  logo: PDFImage;
  chain: string;
  vintages: Vintage[];
  decimals: number;
}

export interface ColumnDefinition {
  header: string;
  key: string;
  width: number;
}

export interface PageDimensions {
  width: number;
  height: number;
}

export interface Margins {
  outer: number;
  inner: number;
}

export interface LogoDimensions {
  width: number;
  height: number;
}

export interface TableDimensions {
  rowHeight: number;
  headerHeight: number;
  titleMargin: number;
}

export interface DetailColumn {
  label: string;
  value: string;
}

export interface SummaryMetric {
  label: string;
  value: string;
}

export interface FontConfig {
  interRegularPath: string;
  interBoldPath: string;
  interSemiBoldPath: string;
}

export interface FormattedTableRow {
  vintage: string;
  amount: string;
  filled: string;
  tx_hash: string;
}
