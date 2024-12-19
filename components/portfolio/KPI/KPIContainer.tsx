'use client';
import { useNetwork } from "@starknet-react/core";
import KPI from "./KPI";
import { sepolia } from "@starknet-react/chains";
import { contracts_mainnet, contracts_sepolia } from "@/config/contracts";

export default function KPIContainer() {
  const { chain } = useNetwork();
  const projects = chain.id === sepolia.id ? contracts_sepolia : contracts_mainnet;

  return (
    <div className="bg-neutral-800 dark:bg-neutral-50 p-4 rounded-lg shadow-lg">
      <KPI title="Number of projects" value={projects.length.toString()} />
    </div>
  );
}