'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo } from 'react';
import { ProjectView } from '@/types/projects';
import { projects_mainnet, projects_sepolia, ProjectWithAbi } from '@/config/projects';
import { sepolia } from '@starknet-react/chains';
import { useAccount, useNetwork, useProvider } from '@starknet-react/core';
import { fetchAbi } from '@/utils/abi';
import { Contract } from 'starknet';
import { convertToBigIntArray } from '@/utils/starknet';

interface ProjectsContextState {
  selectedProjectsView: ProjectView;
  setSelectedProjectsView: (view: ProjectView) => void;
  projects: ProjectWithAbi[];
  myProjects: ProjectWithAbi[];
  isLoading: boolean;
  isLoadingUserData: boolean;
  refreshUserData: () => Promise<void>;
  projectsWithBalance: number;
}

const ProjectsContext = createContext<ProjectsContextState | undefined>(undefined);

interface ProjectsProviderProps {
  children: ReactNode;
}

export function ProjectsProvider({ children }: ProjectsProviderProps) {
  const { chain } = useNetwork();
  const { provider } = useProvider();
  const { isConnected, address } = useAccount();
  const [selectedProjectsView, setSelectedProjectsView] = useState<ProjectView>('all');
  const [initialized, setInitialized] = useState(false);
  const [projects, setProjects] = useState<ProjectWithAbi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);
  const [previousChainId, setPreviousChainId] = useState<bigint | null>(null);

  // Derive myProjects and projectsWithBalance from projects
  const { myProjects, projectsWithBalance } = useMemo(() => {
    const projectsWithPositiveBalance = projects.filter(project => 
      project.userBalance?.some(balance => balance > BigInt(0)) ?? false
    );
    return {
      myProjects: projectsWithPositiveBalance,
      projectsWithBalance: projectsWithPositiveBalance.length
    };
  }, [projects]);

  const initializeProjects = useCallback(async () => {
    // Skip if we're already initialized with the same chain
    if (initialized && previousChainId === chain.id) return;
    
    setIsLoading(true);
    const baseProjects = chain.id === sepolia.id ? projects_sepolia : projects_mainnet;

    try {
      const projectsWithAbis = await Promise.all(
        baseProjects.map(async (project): Promise<ProjectWithAbi> => {
          try {
            const abi = await fetchAbi(provider, project.project);

            if (!abi) {
              console.error(`No ABI found for project ${project.project}`);
              return { ...project };
            }

            const contract = new Contract(abi, project.project, provider);
            return { ...project, abi, contract };
          } catch (error) {
            console.error(`Failed to fetch ABI for project ${project.project}:`, error);
            return { ...project };
          }
        })
      );

      setProjects(projectsWithAbis);
      setPreviousChainId(chain.id);
      setInitialized(true);
    } catch (error) {
      console.error('Failed to initialize projects:', error);
      setProjects(baseProjects);
      setInitialized(true);
    } finally {
      setIsLoading(false);
    }
  }, [chain.id, provider, previousChainId, initialized]);

  const fetchUserData = useCallback(async () => {
    if (!isConnected || !address || projects.length === 0) return;

    setIsLoadingUserData(true);
    console.log('Fetching user data');
  
    try {
      const updatedProjects = await Promise.all(
        projects.map(async (project) => {
          if (!project.contract) return { ...project };
  
          try {
            const balances = await project.contract.get_balances(address);
            return {
              ...project,
              userBalance: convertToBigIntArray(balances),
            };
          } catch (error) {
            console.error(`Failed to fetch user data for project ${project.project}:`, error);
            return { ...project };
          }
        })
      );
      
      setProjects(updatedProjects);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setIsLoadingUserData(false);
    }
  }, [isConnected, address]);

  const resetUserData = useCallback(() => {
    console.log('Resetting user data');
    setProjects(projects => projects.map(project => ({
      ...project,
      userBalance: undefined
    })));
  }, []);

  // Initialize on mount or chain change
  useEffect(() => {
    if (!initialized || previousChainId !== chain.id) {
      // Reset user data only on chain change
      if (previousChainId !== null && previousChainId !== chain.id) {
        resetUserData();
      }
      initializeProjects();
    }
  }, [chain.id, initializeProjects, initialized, previousChainId, resetUserData]);

  // Handle wallet connection/disconnection and fetch initial data
  useEffect(() => {
    if (isConnected && address && projects.length > 0) {
      // Only fetch if we don't have any user data
      if (!projects.some(project => project.userBalance !== undefined)) {
        fetchUserData();
      }
    } else if (!isConnected) {
      resetUserData();
    }
  }, [isConnected, address, fetchUserData, resetUserData, projects.length]);

  const value = {
    selectedProjectsView,
    setSelectedProjectsView,
    projects,
    myProjects,
    isLoading,
    isLoadingUserData,
    refreshUserData: fetchUserData,
    projectsWithBalance,
  };

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects(): ProjectsContextState {
  const context = useContext(ProjectsContext);
  
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  
  return context;
}

export function useProject(slug: string): { 
  project?: ProjectWithAbi; 
  isLoading: boolean;
  isLoadingUserData: boolean;
  refreshUserData: () => Promise<void>;
  projectsWithBalance: number;
  myProjects: ProjectWithAbi[];
} {
  const { projects, isLoading, isLoadingUserData, refreshUserData, projectsWithBalance, myProjects } = useProjects();
  
  // Don't show loading state if we already have the project
  const project = projects.find(p => p.id === slug);
  const effectiveIsLoading = isLoading && !project;
  
  return { 
    project, 
    isLoading: effectiveIsLoading, 
    isLoadingUserData, 
    refreshUserData, 
    projectsWithBalance, 
    myProjects 
  };
}