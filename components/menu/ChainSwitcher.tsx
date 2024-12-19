'use client';
import MenuItem from "./MenuItem";
import { Switch } from "@nextui-org/react";
import { useAccount, useNetwork, useSwitchChain } from "@starknet-react/core";
import { constants } from "starknet";
import { sepolia, mainnet } from "@starknet-react/chains";
import { useEffect, useState } from "react";


export default function ChainSwitcher() {
  const [isSelected, setIsSelected] = useState(true);
  const [menuTitle, setMenuTitle] = useState("Mainnet");
  const { chain } = useNetwork();
  const { status } = useAccount();
  const { switchChain } = useSwitchChain({
    params: {
      chainId:
        chain.id === sepolia.id
          ? constants.StarknetChainId.SN_MAIN
          : constants.StarknetChainId.SN_SEPOLIA,
    },
  });

  useEffect(() => {
    setIsSelected(chain.id === mainnet.id);
    setMenuTitle(chain.id === mainnet.id ? "Mainnet" : "Sepolia");
  }, [chain]);


  return (
    <div className="flex items-center justify-between w-full">
      <MenuItem title={menuTitle} icon="blockchain" />
      <Switch
        isSelected={isSelected}
        isDisabled={status === "disconnected"}
        color="primary"
        size="sm"
        onValueChange={() => switchChain()}
      >
      </Switch>
    </div>
  );
}