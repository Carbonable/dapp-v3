import { cn } from "@heroui/theme";

interface ButtonProps {
  onClick?: () => void;
  classNames?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

export default function Button({ children, classNames, onClick, disabled }: ButtonProps) {
  return (
    <>
      <button 
        className={cn(`px-3 py-2 text-sm w-fit text-neutral-800 border border-neutral-800 dark:text-neutral-100 dark:hover:text-neutral-50 dark:border-neutral-100 dark:hover:border-greenish-500 rounded-full hover:bg-greenish-500 hover:border-greenish-500 hover:text-neutral-50 uppercase`, classNames)}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    </>
  );
}