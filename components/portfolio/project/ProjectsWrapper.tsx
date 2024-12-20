'use client';
import { useProjects } from "@/providers/ProjectsProvider";
import { ImageCard } from "./ImageCard";

export default function ProjectsWrapper() {
  const { projects } = useProjects();

  if (!projects.length) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-lg text-neutral-500 dark:text-neutral-400">No projects found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => (
        <ImageCard key={index} project={project} />
      ))}
    </div>
  );
}