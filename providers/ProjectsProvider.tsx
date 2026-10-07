'use client';

import { createContext, useContext, useEffect, useRef, useState, ReactNode, useCallback, useMemo } from 'react';
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
  // Chain whose projects are being fetched right now. starknet-react swaps the provider object right
  // after mount and again when a wallet connects, which re-runs initializeProjects while the first
  // fetch is still pending: without this guard every class is fetched two or three times.
  const inFlightChainId = useRef<bigint | null>(null);

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
    // Skip if we're already initialized with the same chain, or already fetching it
    if (initialized && previousChainId === chain.id) return;
    if (inFlightChainId.current === chain.id) return;
    inFlightChainId.current = chain.id;

    setIsLoading(true);
    const baseProjects = chain.id === sepolia.id ? projects_sepolia : projects_mainnet;

    try {
      // Fetch each class once: the projects of a network share the same offsettor
      const addresses = [...new Set(baseProjects.flatMap((project) => [project.project, project.offsettor]))];
      const abis = new Map(
        await Promise.all(
          addresses.map(async (address) => {
            const abi = await fetchAbi(provider, address).catch((error) => {
              console.error(`Failed to fetch ABI of ${address}:`, error);
              return undefined;
            });
            return [address, abi] as const;
          })
        )
      );

      const projectsWithAbis = baseProjects.map((project): ProjectWithAbi => {
        const projectAbi = abis.get(project.project);
        const offsettorAbi = abis.get(project.offsettor);

        if (!projectAbi) {
          console.error(`No ABI found for project ${project.project}`);
          return { ...project };
        }

        return {
          ...project,
          abi: projectAbi,
          contract: new Contract(projectAbi, project.project, provider),
          offsettorAbi,
          offsettorContract: offsettorAbi ? new Contract(offsettorAbi, project.offsettor, provider) : undefined,
        };
      });

      setProjects(projectsWithAbis);
      setPreviousChainId(chain.id);
      setInitialized(true);
    } catch (error) {
      console.error('Failed to initialize projects:', error);
      setProjects(baseProjects);
      setInitialized(true);
    } finally {
      inFlightChainId.current = null;
      setIsLoading(false);
    }
  }, [chain.id, provider, previousChainId, initialized]);

  const fetchUserData = useCallback(async () => {
    if (!isConnected || !address || projects.length === 0) return;

    setIsLoadingUserData(true);
  
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
    setProjects(projects => projects.map(project => ({
      ...project,
      userBalance: undefined,
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
} {
  const { projects, isLoading, isLoadingUserData, refreshUserData } = useProjects();
  
  // Don't show loading state if we already have the project
  const project = projects.find(p => p.id === slug);
  const effectiveIsLoading = isLoading && !project;
  
  return { 
    project,
    isLoading: effectiveIsLoading, 
    isLoadingUserData, 
    refreshUserData,
  };
}