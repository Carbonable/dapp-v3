'use client';
import { ProjectWithAbi } from "@/config/projects";
import Title from "../common/Title";
import Button from "../common/Button";
import { useAccount, useReadContract } from "@starknet-react/core";
import VintagesTable from "./VintagesTable";
import { CertificateDownloadButton } from "../certificate/CertificateDownloadButton";
import { OffsetData, Vintage } from "@/types/projects";
import { useProjects } from "@/providers/ProjectsProvider";
import { useEffect, useState } from "react";
import { num } from "starknet";

interface VintagesQueryProps {
  project: ProjectWithAbi;
}
export default function VintagesQuery({ project }: VintagesQueryProps) {
  const { address, isConnected } = useAccount();
  const { isLoading: isLoadingProjects } = useProjects();
  const [filteredOffsettorData, setFilteredOffsettorData] = useState<OffsetData[]>([]);
  const { 
    data: vintagesData, 
    error: vintagesError, 
    isLoading: isLoadingVintages,
    refetch: refetchVintages,
  } = useReadContract({
    abi: project.abi,
    address: project.project as `0x${string}`,
    functionName: "get_cc_vintages",
    args: [],
    watch: true,
    enabled: !!project.abi ,
  });

  const {
    data: offsettorData,
    error: offsettorError,
    isLoading: isLoadingOffsettor,
    refetch: refetchOffsettor,
  } = useReadContract({
    abi: project.offsettorAbi,
    address: project.offsettor as `0x${string}`,
    functionName: "get_requests",
    args: [address],
    watch: true,
    enabled: !!project.offsettorAbi && !!address,
  });

  useEffect(() => {
    if (!offsettorData) {
      setFilteredOffsettorData([]);
      return;
    }

    setFilteredOffsettorData((offsettorData as OffsetData[]).filter((data) => data.project_address === num.toBigInt(project.project)));
  }, [offsettorData, project]);

  useEffect(() => {
    if (!isConnected) {
      setFilteredOffsettorData([]);
    }
  }, [isConnected]);

  if (project.abi === undefined) {
    // The provider only publishes the projects once their classes are fetched: a missing ABI
    // after loading means the RPC request failed (for example rejected by the gateway).
    return (
      <>
        <Title title={"Carbon distribution"} />
        {isLoadingProjects ? (
          <div>Loading ABI...</div>
        ) : (
          <div className="flex flex-wrap items-center gap-4">
            <span>Error loading the project contract from the RPC node.</span>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        )}
      </>
    );
  }

  if (vintagesError) {
    return (
      <>
        <Title title={"Carbon distribution"} />
        <div>Error loading vintages data: {vintagesError.message}</div>
      </>
    );
  }

  if (offsettorError) {
    console.error('Error loading offsettor data:', offsettorError);
  }

  if (isLoadingVintages) {
    return (
      <>
        <Title title={"Carbon distribution"} />
        <div>Loading data...</div>
      </>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <Title title={"Carbon distribution"} />
        <CertificateDownloadButton
          disabled={!isConnected} 
          data={{ 
            title: `Carbon distribution`,
            deliveredTo: address,
            certifier: project.certifier,
            developer: project.developer,
            projectName: project.name,
            location: project.country,
            projectType: project.metadata.type,
            category: project.metadata.category,
            gpsLocation: project.gpsLocation,
            vintages: vintagesData as Vintage[] || [],
            offsettorData: filteredOffsettorData || [],
            decimals: project.decimals,
          }} 
        />
      </div>
      <div className="mt-4">
        <VintagesTable
          vintages={vintagesData || []}
          offsettorData={filteredOffsettorData || []}
          project={project}
          isLoadingOffsettorData={isLoadingOffsettor}
          refetchOffsettor={refetchOffsettor}
          refetchVintages={refetchVintages}
        />
      </div>
    </>
  );
}