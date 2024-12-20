'use client';
import ProjectAbisWrapper from "@/providers/ProjectAbiProvider";
import { useProjects } from "@/providers/ProjectsProvider";
import { use } from "react";

export default function Project({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { projects } = useProjects();
  const project = projects.find((project) => project.id === slug);

  return (
    <div>
      <ProjectAbisWrapper project={project}>
        <h1>Project: {slug}</h1>
      </ProjectAbisWrapper>
    </div>
  );
}