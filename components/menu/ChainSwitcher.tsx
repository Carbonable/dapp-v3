'use client';
import MenuItem from "./MenuItem";
import { Switch } from "@nextui-org/react";
import { useNetwork, useSwitchChain } from "@starknet-react/core";
import { constants } from "starknet";
import { sepolia } from "@starknet-react/chains";
import { useEffect, useState } from "react";


export default function ChainSwitcher() {
  const defaultChain = process.env.NEXT_PUBLIC_DEFAULT_CHAIN;
  const [isSelected, setIsSelected] = useState(defaultChain === sepolia.network ? false : true);
  const [menuTitle, setMenuTitle] = useState(defaultChain === sepolia.network ? "Sepolia" : "Mainnet");
  const { chain } = useNetwork();
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
    switchChain({ chainId: chain.id === sepolia.id ? constants.StarknetChainId.SN_SEPOLIA : constants.StarknetChainId.SN_MAIN });
  }, [chain]);

  return (
    <div className="flex items-center justify-between w-full">
      <MenuItem title={menuTitle} icon="blockchain" />
      <Switch
        isSelected={isSelected}
        color="primary"
        size="sm"
        onValueChange={() => switchChain()}
      >
      </Switch>
    </div>
  );
}