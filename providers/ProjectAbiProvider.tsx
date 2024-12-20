'use client';
import { Project } from "@/config/projects";
import { fetchAbi } from "@/utils/abi";
import { useProvider } from "@starknet-react/core";
import { createContext, useContext, useEffect, useState } from "react";
import type { Abi } from "starknet";

type ProjectAbiContextType = {
    projectAbi: Abi,
    projectAddress: string | undefined,
}

const ProjectAbiContext = createContext<ProjectAbiContextType>({} as ProjectAbiContextType);

export default function ProjectAbisWrapper({ children, project }: { children: React.ReactNode, project: Project | undefined }) {
    const { provider } = useProvider();

    const [projectAbi, setProjectAbi] = useState<Abi|undefined>(undefined);
    
    useEffect(() => {
        async function fetchProjectAbiWrapper() {
            if (project === undefined) { return; }
            const projectAbiResult = await fetchAbi(provider, project.project);
            setProjectAbi(projectAbiResult);

        }
        fetchProjectAbiWrapper();
    }, [provider, project]);

    if (projectAbi === undefined) { return null; }

    return (
        <ProjectAbiContext.Provider 
            value={{ projectAbi, projectAddress: project?.project }}
        >
            { children }
        </ProjectAbiContext.Provider>
    );
}


export function useProjectAbis() {
    return useContext(ProjectAbiContext);
}