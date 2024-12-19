'use client';
import { ThemeProvider } from "@/providers/ThemeProvider";
import Header from "@/components/menu/Header";
import LeftMenu from "@/components/menu/LeftMenu";
import { NextUIProvider } from "@nextui-org/react";

import { ReactNode } from "react";
import StarknetProvider from "@/providers/StarknetProvider";

export default function DefaultLayout({ children }: { children: ReactNode }) {
  return (
    <NextUIProvider>
      <ThemeProvider>
        <StarknetProvider>
          <header className="fixed top-0 w-full z-50 md:w-[calc(100vw_-_280px)] md:ml-[280px]">
            <Header />
          </header>
          <main className="flex flex-col md:flex-row">
            <div className="hidden md:block md:w-[280px] border-r border-neutral-100 dark:border-neutral-200 md:h-screen">
              <LeftMenu />
            </div>
            <div className="w-full min-h-[calc(100vh_-_64px)] mt-[64px] max-w-5xl mx-auto px-4">
              {children}
            </div>
          </main>
          <footer></footer>
        </StarknetProvider>
      </ThemeProvider>
    </NextUIProvider>
  );
}