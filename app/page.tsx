'use client';
import ProjectsViewTabs from "@/components/portfolio/common/ProjectsViewTabs";
import KPIContainer from "@/components/portfolio/KPI/KPIContainer";
import ProjectsWrapper from "@/components/portfolio/project/ProjectsWrapper";


export default function Home() {
  return (
    <>
      <div className="mt-8">
        <KPIContainer />
      </div>
      <div className="mt-12">
        <ProjectsViewTabs />
      </div>
      <div className="mt-8">
        <ProjectsWrapper />
      </div>
    </>
  );
}