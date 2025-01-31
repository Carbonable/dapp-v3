'use client';
import { ThemeProvider } from "@/providers/ThemeProvider";
import Header from "@/components/menu/Header";
import LeftMenu from "@/components/menu/LeftMenu";
import { Alert, HeroUIProvider } from "@heroui/react";

import { ReactNode } from "react";
import StarknetProvider from "@/providers/StarknetProvider";
import { ProjectsProvider } from "@/providers/ProjectsProvider";

export default function DefaultLayout({ children }: { children: ReactNode }) {
  return (
    <HeroUIProvider>
      <ThemeProvider>
        <StarknetProvider>
          <Alert
            color="primary" 
            title="Carbonable Protocol v3" 
            className="fixed top-0 w-full text-center h-[72px] z-50 flex items-center opacity-100 dark:bg-primary-50"
          >
            <a 
              href="https://app-v2.carbonable.io"
              target="_blank" 
              rel="noreferrer"
              className="underline text-center w-full"
            >
              Go to carbonable v2 to claim your pending rewards
            </a>
          </Alert>
          <header className="fixed top-[72px] right-0 h-16 w-full md:w-[calc(100%_-_280px)] z-50">
            <Header />
          </header>
          <main className="flex">
            <div className="fixed top-[72px] left-0 hidden md:block w-[280px] h-screen border-r border-neutral-100 dark:border-neutral-700">
              <LeftMenu />
            </div>
            <div className="flex-1 md:ml-[280px]"> {/* Added wrapper div */}
              <div className="w-full min-h-screen mt-28 max-w-5xl mx-auto px-4 overflow-y-auto">
              <ProjectsProvider>
                {children}
              </ProjectsProvider>
              </div>
            </div>
          </main>
        </StarknetProvider>
      </ThemeProvider>
    </HeroUIProvider>
  );
}