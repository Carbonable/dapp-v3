export interface Project {
  id: string;
  project: string;
  name: string;
  country: string;
  developer: string;
  dates: string;
  certifier: string;
}

export const projects_sepolia: Project[] = [
  {
    "id": "banegas-farm",
    "project": "0x06b7ade36c9856773d69e87828433df0020359689c7d5b5b41c1853acc1dfa57",
    "name": "Banegas farm",
    "country": "Costa Rica",
    "developer": "Corcovado foundation",
    "dates": "2022-2052",
    "certifier": "ERS"
  }
];

export const projects_mainnet: Project[] = [];