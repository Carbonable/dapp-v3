'use client';
import { useProjects } from "@/providers/ProjectsProvider";
import KPI from "./KPI";

export default function KPIContainer() {
  const { projects } = useProjects();

  return (
    <div className="bg-neutral-800 dark:bg-neutral-50 p-4 rounded-lg shadow-lg">
      <KPI title="Number of projects" value={projects.length.toString()} />
    </div>
  );
}