import type { Abi, Contract } from 'starknet';

export interface Project {
  id: string;
  project: string;
  offsettor: string;
  name: string;
  country: string;
  developer: string;
  dates: string;
  certifier: string;
  decimals: number;
  metadata: MetaData;
  sdgs: string[];
  due_diligence: string;
  medium_article: string;
  impact_reports: ImpactReport[];
  map: string;
  gpsLocation: string;
}

export interface ProjectWithAbi extends Project {
  abi?: Abi;
  contract?: Contract;
  userBalance?: bigint[];
  offsettorAbi?: Abi;
  offsettorContract?: Contract;
}

export interface MetaData {
  type: 'ARR' | 'REDD+';
  category: 'Forest';
  area: string;
  carbon_units: string;
  ranking: string;
}

export interface ImpactReport {
  name: string;
  link: string;
  date: string;
}

export const projects_sepolia: Project[] = [
  {
    id: "banegas-farms",
    project: "0x00542b4a81cad076be3cf1d05bfdb02396773ec40b5e8d25d62ba38151ac2e85",
    offsettor: "0x004824be70b627fa327fbc5fd07618896ef1570d45bfeeea08a57f64285067b8",
    name: "Banegas Farms",
    country: "Costa Rica",
    developer: "Corcovado foundation",
    dates: "2022-2052",
    certifier: "ERS",
    decimals: 9,
    metadata: {
      type: "ARR",
      category: "Forest",
      area: "4 ha",
      carbon_units: "1573",
      ranking: "A"
    },
    sdgs: ["8", "13", "15"],
    due_diligence: "https://carbonable.github.io/projects/banegas-farm/Due_diligence_-_Banegas.pdf",
    medium_article: "https://carbonable.medium.com/banegas-farm-reforesting-to-be-finance-by-carbonables-160-nfts-b4b36b5a4645",
    impact_reports: [
      {
        name: "Impact September 22",
        link: "https://carbonable.github.io/projects/banegas-farm/092022-BanegasFarm-QuarterlyReport.pdf",
        date: "09-2022"
      }
    ],
    map: "https://maps.app.goo.gl/F5FxPCEJJLkqLvz47",
    gpsLocation: "41.40338, 2.17403"
  }
];

export const projects_mainnet: Project[] = [];