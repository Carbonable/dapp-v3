'use client';
import { PowerIcon, WalletIcon } from "@heroicons/react/16/solid";
import Button from "../common/Button";
import Address from "../common/Address";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import { StarknetkitConnector, useStarknetkitConnectModal } from "starknetkit";

export default function ConnectWallet() {
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { address } = useAccount();
  const { starknetkitConnectModal } = useStarknetkitConnectModal({
    connectors: connectors as unknown as StarknetkitConnector[]
  })

  const connectWallet = async () => {
    const { connector } = await starknetkitConnectModal()
    if (!connector) {
      return
    }
  
    connect({ connector })
  }

  const disconnectWallet = () => {
    disconnect()
  }

  if (address) {
    return (
      <>
        <PowerIcon onClick={disconnectWallet} className="w-8 h-8 cursor-pointer border border-neutral-800 rounded-full p-1 hover:text-neutral-900 dark:border-neutral-200 dark:hover:border-neutral-100 md:hidden" />
        <div className="hidden md:flex items-center cursor-pointer px-4 py-2 border border-neutral-500 dark:border-neutral-500 rounded-full" onClick={disconnectWallet}>
          <Address />
        </div>
      </>
    );
  }

  return (
    <>
      <WalletIcon onClick={connectWallet} className="w-8 h-8 cursor-pointer border border-neutral-800 rounded-full p-1 hover:text-neutral-900 dark:border-neutral-200 dark:hover:border-neutral-100 md:hidden" />
      <Button onClick={connectWallet} text="Connect Wallet" classnames="hidden md:block" />
    </>
  );
}