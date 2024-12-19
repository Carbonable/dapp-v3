'use client';
import { useTheme } from "@/providers/ThemeProvider";
import Image from "next/image";
import ConnectWallet from "./ConnectWallet";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const { theme } = useTheme();

  return (
    <div className="flex items-center justify-between w-full h-16 px-4 backdrop-blur-sm bg-neutral-50/80 dark:bg-neutral-900/80 shadow-md md:shadow-none md:px-8 md:justify-end">
      <div className="block md:hidden">
        <MobileMenu />
      </div>
      <div className="block md:hidden">
        <Image src={`/assets/carbonable-${theme}.svg`} alt="Carbonable logo" width={140} height={60} />
      </div>
      <div>
        <ConnectWallet />
      </div>
    </div>
  );
}