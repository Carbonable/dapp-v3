'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ProjectView } from '@/types/projects';
import { projects_mainnet, projects_sepolia } from '@/config/projects';
import { sepolia } from '@starknet-react/chains';
import { useNetwork } from '@starknet-react/core';

// Define the context state interface
interface ProjectsContextState {
  selectedProjectsView: ProjectView;
  setSelectedProjectsView: (view: ProjectView) => void;
  projects: typeof projects_mainnet; // Assuming both arrays have the same type
}

// Create the context with a default value
const ProjectsContext = createContext<ProjectsContextState | undefined>(undefined);

// Props interface for the provider
interface ProjectsProviderProps {
  children: ReactNode;
}

// Provider component
export function ProjectsProvider({ children }: ProjectsProviderProps) {
  const { chain } = useNetwork();
  const [selectedProjectsView, setSelectedProjectsView] = useState<ProjectView>('all');
  const [projects, setProjects] = useState(
    chain.id === sepolia.id ? projects_sepolia : projects_mainnet
  );

  useEffect(() => {
    setProjects(chain.id === sepolia.id ? projects_sepolia : projects_mainnet);
  }, [chain]);

  const value = {
    selectedProjectsView,
    setSelectedProjectsView,
    projects,
  };

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
}

// Custom hook for using the projects context
export function useProjects(): ProjectsContextState {
  const context = useContext(ProjectsContext);
  
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  
  return context;
}