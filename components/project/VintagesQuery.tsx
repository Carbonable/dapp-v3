'use client';
import { Project } from "@/config/projects";
import Title from "../common/Title";
import { useProjectAbis } from "@/providers/ProjectAbiProvider";
import { useReadContract } from "@starknet-react/core";
import VintagesTable from "./VintagesTable";

interface VintagesQueryProps {
  project: Project;
}
export default function VintagesQuery({ project }: VintagesQueryProps) {
  const { projectAbi } = useProjectAbis();
  const { data, error, isLoading } = useReadContract({
    abi: projectAbi,
    address: project.project as `0x${string}`,
    functionName: "get_cc_vintages",
    args: [],
  });

  if (projectAbi === undefined) {
    return (
      <>
        <Title title={"Carbon distribution"} />
        <div>Loading ABI...</div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Title title={"Carbon distribution"} />
        <div>Error loading data: {error.message}</div>
      </>
    );
  }

  if (isLoading === true) {
    return (
      <>
        <Title title={"Carbon distribution"} />
        <div>Loading data...</div>
      </>
    );
  }

  return (
    <>
      <Title title={"Carbon distribution"} />
      <div className="mt-4">
       <VintagesTable vintages={data} />
      </div>
    </>
  );
}