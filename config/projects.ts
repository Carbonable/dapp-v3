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
  status: 'live' | 'paused';
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
  category: 'Forest' | 'Mangrove';
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
    gpsLocation: "41.40338, 2.17403",
    status: 'live',
  }
];

export const projects_mainnet: Project[] = [
  {
    id: "banegas-farms",
    project: "0x05e2acc410a94af22b18441d96fc7ed29afee4a77e6ed5907587aa9a1347b6bc",
    offsettor: "0x05cab6be74d252d6e1280c44353c48c98e3d0757ceebb1fc4c3a9aa67769cca1",
    name: "Banegas Farms",
    country: "Costa Rica",
    developer: "Corcovado Foundation",
    dates: "2022-2051",
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
    map: "https://maps.app.goo.gl/5152BD3DRvzbNL9H6",
    gpsLocation: "8.701643683464424, -83.5534715922547",
    status: 'live',
  },
  {
    id: "las-delicias",
    project: "0x024f3b0c169d5e3505bffaa5baa2a55e0a06169c70f2e35a637a5588e184862c",
    offsettor: "0x05cab6be74d252d6e1280c44353c48c98e3d0757ceebb1fc4c3a9aa67769cca1",
    name: "Las Delicias",
    country: "Panama",
    developer: "Fundación Naturaleza Panamá",
    dates: "2022-2041",
    certifier: "ERS",
    decimals: 9,
    metadata: {
      type: "ARR",
      category: "Mangrove",
      area: "18 ha",
      carbon_units: "3603",
      ranking: "A"
    },
    sdgs: ["8", "13", "14", "15"],
    due_diligence: "https://carbonable.github.io/projects/las-delicias/Due_diligence_-_Las_Delicias.pdf",
    medium_article: "https://carbonable.medium.com/las-delicias-carbonables-first-mangrove-restoration-project-6a12ada6729c",
    impact_reports: [
      {
        name: "Impact September 22",
        link: "https://carbonable.github.io/projects/las-delicias/092022-LasDelicias-QuarterlyReport.pdf",
        date: "09-2022"
      }
    ],
    map: "https://maps.app.goo.gl/bWKEvnyKK9RAcFFk9",
    gpsLocation: "9.3452, -82.2414",
    status: 'live',
  },
  {
    id: "manjarisoa",
    project: "0x05adde4f0fd146bca13824709a73f132d6923327cab7eaa1efcc6de585623631",
    offsettor: "0x05cab6be74d252d6e1280c44353c48c98e3d0757ceebb1fc4c3a9aa67769cca1",
    name: "Manjarisoa",
    country: "Madagascar",
    developer: "ForestCalling Action",
    dates: "2023-2042",
    certifier: "ERS",
    decimals: 9,
    metadata: {
      type: "ARR",
      category: "Forest",
      area: "21 ha",
      carbon_units: "8000",
      ranking: "A"
    },
    sdgs: ["8", "13", "15"],
    due_diligence: "https://carbonable.github.io/projects/manjarisoa/Due_diligence_-_Manjarisoa.pdf",
    medium_article: "https://carbonable.medium.com/1762-carbonable-nfts-coming-soon-to-fight-deforestation-on-madagascar-the-manjarisoa-project-1a21c81a3416",
    impact_reports: [],
    map: "https://maps.app.goo.gl/KnHC4tNAJTYAagf17",
    gpsLocation: "-18.455755744135708,49.103883937895546",
    status: 'paused',
  },
  {
    id: "karathuru",
    project: "0x02ad4a4939aaa7428d952b629172f2feb170e78911f07f946d9a52e11d6d5011",
    offsettor: "0x05cab6be74d252d6e1280c44353c48c98e3d0757ceebb1fc4c3a9aa67769cca1",
    name: "Karathuru",
    country: "Myanmar",
    developer: "Worldview International Foundation",
    dates: "2023-2046",
    certifier: "Verra",
    decimals: 9,
    metadata: {
      type: "ARR",
      category: "Mangrove",
      area: "86 ha",
      carbon_units: "70589",
      ranking: "AA"
    },
    sdgs: ["4", "5", "8", "13", "14", "15"],
    due_diligence: "https://carbonable.github.io/projects/karathuru/Due_diligence_-_Karathuru.pdf",
    medium_article: "",
    impact_reports: [],
    map: "https://maps.app.goo.gl/P9GhCLsL3f6Hvu1q7",
    gpsLocation: "11.096389, 98.689444",
    status: 'live',
  }
];