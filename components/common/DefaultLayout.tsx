'use client';
import { ThemeProvider } from "@/providers/ThemeProvider";
import Header from "@/components/menu/Header";
import LeftMenu from "@/components/menu/LeftMenu";
import { NextUIProvider } from "@nextui-org/react";

import { ReactNode } from "react";

export default function DefaultLayout({ children }: { children: ReactNode }) {
  return (
    <NextUIProvider>
      <ThemeProvider>
        <header className="fixed top-0 w-full z-50 md:w-[calc(100vw_-_220px)] md:ml-[220px]">
          <Header />
        </header>
        <main>
          <div className="hidden md:block md:w-[220px] border-r border-neutral-300 dark:border-neutral-200 md:h-screen">
            <LeftMenu />
          </div>
          <div className="w-full min-h-[calc(100vh_-_64px)] mt-[64px] md:w-[calc(100vw_-_220px)] md:ml-[220px]">
            {children}
          </div>
        </main>
        <footer></footer>
      </ThemeProvider>
    </NextUIProvider>
  );
}