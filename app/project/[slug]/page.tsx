'use client';
import Title from "@/components/common/Title";
import { ImageCard } from "@/components/portfolio/project/ImageCard";
import ProjectMetadata from "@/components/project/ProjectMetadata";
import SDG from "@/components/project/SDG";
import ProjectAbisWrapper from "@/providers/ProjectAbiProvider";
import { useProjects } from "@/providers/ProjectsProvider";
import { use } from "react";

export default function Project({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { projects } = useProjects();
  const project = projects.find((project) => project.id === slug);

  if (!project) return null;

  const metadataEntries = Object.entries(project.metadata).map(([key, value]) => ({
    label: key.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' '),
    value: value
  }));

  return (
    <div>
      <ProjectAbisWrapper project={project}>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          <ImageCard project={project} canNavigate={false} />
          <div className="col-span-1 xl:col-span-2">
            <div>
              <Title title={"Metadata"} />
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-2">
                {metadataEntries.map(({ label, value }) => (
                  <ProjectMetadata key={label} label={label} value={value} />
                ))}
              </div>
            </div>
            <div className="mt-4">
              <Title title={"Impact on"} />
              <div className="flex flex-wrap gap-2">
                {project.sdgs.map((sdg, index) => (
                  <SDG key={index} sdgId={sdg} width={52} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </ProjectAbisWrapper>
    </div>
  );
}