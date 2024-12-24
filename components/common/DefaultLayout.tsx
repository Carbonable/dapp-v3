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
        <header className="fixed top-0 right-0 h-16 w-full md:w-[calc(100%_-_280px)] md:ml-[280px] z-50">
          <Header />
        </header>
        <main className="flex">
          <div className="fixed left-0 hidden md:block w-[280px] h-screen border-r border-neutral-100 dark:border-neutral-700">
            <LeftMenu />
          </div>
          <div className="w-full md:ml-[280px] min-h-screen mt-16 max-w-5xl mx-auto px-4 overflow-y-auto">
            {children}
          </div>
        </main>
        </StarknetProvider>
      </ThemeProvider>
    </NextUIProvider>
  );
}