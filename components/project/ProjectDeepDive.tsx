import { Project } from "@/config/projects";
import Title from "../common/Title";
import { DocumentIcon, LinkIcon, MapPinIcon } from "@heroicons/react/24/outline";

interface ProjectDeepDiveProps {
  project: Project;
}

export default function ProjectDeepDive({ project }: ProjectDeepDiveProps) {
  return (
    <>
      <Title title={"Project deep dive"} />
      <div className="mt-4">
        <a href={project.due_diligence} target="_blank" rel="noreferrer">
          <div className="flex items-center gap-2">
            <DocumentIcon className="h-4 w-4" />
            <div className="hover:underline">Due diligence</div>
          </div>
        </a>
      </div>
      <div className="mt-2">
        <a href={project.medium_article} target="_blank" rel="noreferrer">
          <div className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4" />
            <div className="hover:underline">Medium article</div>
          </div>
        </a>
      </div>
      <div className="mt-2">
        <a href={project.map} target="_blank" rel="noreferrer">
          <div className="flex items-center gap-2">
            <MapPinIcon className="h-4 w-4" />
            <div className="hover:underline">View on map</div>
          </div>
        </a>
      </div>
    </>
  );
}
