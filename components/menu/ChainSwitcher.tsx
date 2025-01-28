'use client';
import MenuItem from "./MenuItem";
import { Switch } from "@heroui/react";
import { useAccount, useNetwork, useSwitchChain } from "@starknet-react/core";
import { constants } from "starknet";
import { sepolia } from "@starknet-react/chains";
import { useEffect, useState } from "react";


export default function ChainSwitcher() {
  const { chain } = useNetwork();
  const { status } = useAccount();
  const [isSelected, setIsSelected] = useState(chain.id === sepolia.id ? false : true);
  const [menuTitle, setMenuTitle] = useState(chain.id === sepolia.id ? "Sepolia" : "Mainnet");
  const { switchChain } = useSwitchChain({
    params: {
      chainId:
        chain.id === sepolia.id
          ? constants.StarknetChainId.SN_MAIN
          : constants.StarknetChainId.SN_SEPOLIA,
    },
  });

  useEffect(() => {
    setIsSelected(chain.id === sepolia.id ? false : true);
    setMenuTitle(chain.id === sepolia.id ? "Sepolia" : "Mainnet");
  }, [chain]);

  return (
    <div className="flex items-center justify-between w-full">
      <MenuItem title={menuTitle} icon="blockchain" />
      <Switch
        isSelected={isSelected}
        color="success"
        size="sm"
        onValueChange={() => switchChain()}
        isDisabled={status === "disconnected"}
      >
      </Switch>
    </div>
  );
}