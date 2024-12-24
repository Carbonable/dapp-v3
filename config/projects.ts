export interface Project {
  id: string;
  project: string;
  name: string;
  country: string;
  developer: string;
  dates: string;
  certifier: string;
  metadata: MetaData;
  sdgs: string[];
  due_diligence: string;
  medium_article: string;
  impact_reports: ImpactReport[];
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
    project: "0x06b7ade36c9856773d69e87828433df0020359689c7d5b5b41c1853acc1dfa57",
    name: "Banegas Farms",
    country: "Costa Rica",
    developer: "Corcovado foundation",
    dates: "2022-2052",
    certifier: "ERS",
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
    ]
  }
];

export const projects_mainnet: Project[] = [];