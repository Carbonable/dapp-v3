import { useTheme } from "@/providers/ThemeProvider";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/16/solid";
import { cn } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";

interface MenuItemProps {
  title: string;
  icon: React.ReactNode;
  isExternal?: boolean;
  isUppercase?: boolean;
  link?: string;
  className?: string;
}

export default function MenuItem({ title, icon, isExternal = false, isUppercase, link, className }: MenuItemProps) {
  const { theme } = useTheme();
  const wrapperClass = cn('flex items-center justify-start py-2 px-4', link && "rounded-md hover:bg-greenish-500 dark:hover:bg-greenish-500 cursor-pointer text-neutral-800 dark:text-neutral-100", className);
  const textClass = cn('ml-2 font-semibold', isUppercase && 'uppercase');

  if (link && isExternal) {
    return (
      <a href={link} target="_blank" className={wrapperClass}>
        <Image src={`/assets/icons/menu/${icon}-${theme}.svg`} alt="Theme switcher" width={30} height={30} />
        <div className={textClass}>{title}</div>
        <ArrowTopRightOnSquareIcon className="w-5 h-5 ml-2 text-neutral-800 dark:text-neutral-100" />
      </a>
    );
  }

  if (link && !isExternal) {
    return (
      <Link href={link}>
        <div className={wrapperClass}>
          <Image src={`/assets/icons/menu/${icon}-${theme}.svg`} alt="Theme switcher" width={30} height={30} />
          <div className={textClass}>{title}</div>
        </div>
      </Link>
    );
  }

  return (
    <div className={wrapperClass}>
      <Image src={`/assets/icons/menu/${icon}-${theme}.svg`} alt="Theme switcher" width={30} height={30} />
      <div className={textClass}>{title}</div>
      {isExternal && <ArrowTopRightOnSquareIcon className="w-5 h-5 ml-2 text-neutral-800 dark:text-neutral-100" /> }
    </div>
  );
}
