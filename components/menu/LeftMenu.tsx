'use client';
import { useTheme } from "@/providers/ThemeProvider";
import Image from "next/image";

export default function LeftMenu() {
  const { theme } = useTheme();

  return (
    <div>
      <div className="pl-4 pt-4">
        <Image src={`/assets/carbonable-${theme}.svg`} alt="Carbonable logo" width={140} height={60} />
      </div>
    </div>
  );
}