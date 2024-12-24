import { Project } from "@/config/projects";
import Title from "../common/Title";
import { ImageCard } from "../portfolio/project/ImageCard";
import ProjectMetadata from "./ProjectMetadata";
import SDG from "./SDG";

interface ProjectInformationProps {
  project: Project;
}

export default function ProjectInformation({ project }: ProjectInformationProps) {
  const metadataEntries = Object.entries(project.metadata).map(([key, value]) => ({
    label: key.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' '),
    value: value
  }));

  return (
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
  );
}