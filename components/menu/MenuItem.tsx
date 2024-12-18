import { useTheme } from "@/providers/ThemeProvider";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/16/solid";
import { cn } from "@nextui-org/react";
import Image from "next/image";

interface MenuItemProps {
  title: string;
  icon: React.ReactNode;
  isExternal?: boolean;
  isUppercase?: boolean;
}

export default function MenuItem({ title, icon, isExternal, isUppercase }: MenuItemProps) {
  const { theme } = useTheme();
  return (
    <div className="flex items-center justify-start">
      <Image className="dark:stroke-neutral-100 dark:fill-neutral-100" src={`/assets/icons/menu/${icon}-${theme}.svg`} alt="Theme switcher" width={24} height={24} />
      <div className={cn('ml-2 font-semibold text-neutral-800 dark:text-neutral-100', isUppercase && 'uppercase')}>{title}</div>
      {isExternal && <ArrowTopRightOnSquareIcon className="w-4 h-4 ml-4" /> }
    </div>
  );
}
