import { InjectedConnector } from "starknetkit/injected";
import { ArgentMobileConnector, isInArgentMobileAppBrowser } from "starknetkit/argentMobile";
import { WebWalletConnector } from "starknetkit/webwallet";
import { mainnet, sepolia } from "@starknet-react/chains";
import { StarknetConfig, nethermindProvider, publicProvider } from "@starknet-react/core";
import { ReactNode } from "react";
 
export default function StarknetProvider({ children }: { children: ReactNode }) {
  const defaultChain = process.env.NEXT_PUBLIC_DEFAULT_CHAIN;
  const chains = defaultChain === sepolia.network ? [sepolia, mainnet] : [mainnet, sepolia];
  const netherminApiKey = process.env.NEXT_PUBLIC_NETHERMIND_API_KEY;
 
  const connectors = isInArgentMobileAppBrowser() ? [
    ArgentMobileConnector.init({
      options: {
        dappName: "Carbonable dApp",
        projectId: "carbonable-dapp",
        url: "https://app.carbonable.io",
      },
      inAppBrowserOptions: {},
    })
  ] : [
    new InjectedConnector({ options: { id: "braavos", name: "Braavos" }}),
    new InjectedConnector({ options: { id: "argentX", name: "Argent X" }}),
    new WebWalletConnector({ url: "https://web.argent.xyz" }),
    ArgentMobileConnector.init({
      options: {
        dappName: "Carbonable dApp",
        projectId: "carbonable-dapp",
        url: "https://app.carbonable.io",
      },
    })
  ]
 
  return(
    <StarknetConfig
      chains={chains}
      provider={netherminApiKey ? nethermindProvider({ apiKey: netherminApiKey }) : publicProvider()}
      connectors={connectors}
      autoConnect={true}
    >
      {children}
    </StarknetConfig>
  )
}