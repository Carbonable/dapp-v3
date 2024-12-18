import { WalletIcon } from "@heroicons/react/16/solid";
import Button from "../common/Button";

export default function ConnectWallet() {
  return (
    <>
      <WalletIcon className="w-8 h-8 cursor-pointer border border-neutral-800 rounded-full p-1 hover:text-neutral-900 dark:border-neutral-200 dark:hover:border-neutral-100 md:hidden" />
      <Button text="Connect Wallet" classnames="hidden md:block" />
    </>
  );
}