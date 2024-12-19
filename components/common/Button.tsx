import { cn } from "@nextui-org/theme";

interface ButtonProps {
  text: string;
  onClick?: () => void;
  classnames?: string;
}

export default function Button({ text, classnames, onClick }: ButtonProps) {
  return (
    <>
      <button 
        className={cn(`px-3 py-2 text-sm w-fit text-neutral-800 border border-neutral-800 dark:text-neutral-100 dark:hover:text-neutral-50 dark:border-neutral-100 dark:hover:border-greenish-500 rounded-md hover:bg-greenish-500 hover:border-greenish-500 hover:text-neutral-50 uppercase`, classnames)}
        onClick={onClick}
      >
        {text}
      </button>
    </>
  );
}