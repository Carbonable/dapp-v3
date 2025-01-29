import { OffsetData, Vintage } from "./projects";

export interface CertificateData {
  title?: string;
  deliveredTo?: string;
  certifier?: string;
  projectName?: string;
  location?: string;
  developer?: string;
  projectType?: string;
  category?: string;
  gpsLocation?: string;
  offsettingAmount?: string;
  vintages?: Vintage[];
  offsettorData?: OffsetData[];
  decimals?: number;
}