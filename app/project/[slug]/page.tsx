'use client';
import ImpactReports from "@/components/project/ImpactReports";
import ProjectDeepDive from "@/components/project/ProjectDeepDive";
import ProjectInformation from "@/components/project/ProjectInfo";
import ProjectAbisWrapper from "@/providers/ProjectAbiProvider";
import { useProjects } from "@/providers/ProjectsProvider";
import { use } from "react";

export default function Project({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { projects } = useProjects();
  const project = projects.find((project) => project.id === slug);

  if (!project) return null;

  return (
    <div>
      <ProjectAbisWrapper project={project}>
        <h1 className="text-3xl font-bold mb-4">{project.name}</h1>
        <ProjectInformation project={project} />
        <div className="mt-8">
          <ProjectDeepDive project={project} />
        </div>
        <div className="mt-8">
          <ImpactReports project={project} />
        </div>
      </ProjectAbisWrapper>
    </div>
  );
}