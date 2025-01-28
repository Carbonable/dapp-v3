'use client';
import { useProjects } from "@/providers/ProjectsProvider";
import { ProjectView } from "@/types/projects";
import { Tab, Tabs } from "@heroui/react";
import { useAccount } from "@starknet-react/core";
import { useEffect } from "react";

export default function ProjectsViewTabs() {
  const { selectedProjectsView, setSelectedProjectsView, projectsWithBalance } = useProjects();
  const { status } = useAccount();

  useEffect(() => {
    if (status === "disconnected") {
      setSelectedProjectsView("all");
    }
  }, [status]);

  return (
    <Tabs 
      aria-label="Tabs variants" 
      variant="underlined" 
      disabledKeys={status === "disconnected" ? ['my-projects'] : []} 
      onSelectionChange={(key) => setSelectedProjectsView(key as unknown as ProjectView)}
      selectedKey={selectedProjectsView.toString()}
    >
      <Tab key="all" title="All" />
      <Tab key="my-projects" title={`My projects (${projectsWithBalance})`} />
    </Tabs>
  );
}