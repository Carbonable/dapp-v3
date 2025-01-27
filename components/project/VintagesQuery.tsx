'use client';
import { ProjectWithAbi } from "@/config/projects";
import Title from "../common/Title";
import { useAccount, useReadContract } from "@starknet-react/core";
import VintagesTable from "./VintagesTable";

interface VintagesQueryProps {
  project: ProjectWithAbi;
}
export default function VintagesQuery({ project }: VintagesQueryProps) {
  const { address } = useAccount();
  const { 
    data: vintagesData, 
    error: vintagesError, 
    isLoading: isLoadingVintages 
  } = useReadContract({
    abi: project.abi,
    address: project.project as `0x${string}`,
    functionName: "get_cc_vintages",
    args: [],
  });

  const {
    data: offsettorData,
    error: offsettorError,
    isLoading: isLoadingOffsettor
  } = useReadContract({
    abi: project.offsettorAbi,
    address: project.offsettor as `0x${string}`,
    functionName: "get_requests",
    args: [address],
    enabled: !!project.offsettorAbi && !!address, // Only run if offsettor ABI is available
  });

  if (project.abi === undefined) {
    return (
      <>
        <Title title={"Carbon distribution"} />
        <div>Loading ABI...</div>
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

  console.log(offsettorData)

  return (
    <>
      <Title title={"Carbon distribution"} />
      <div className="mt-4">
        <VintagesTable
          vintages={vintagesData || []}
          offsettorData={offsettorData || []}
          project={project}
          isLoadingOffsettorData={isLoadingOffsettor}
        />
      </div>
    </>
  );
}