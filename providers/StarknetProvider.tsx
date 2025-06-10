import { InjectedConnector } from "starknetkit/injected";
import { ArgentMobileConnector, isInArgentMobileAppBrowser } from "starknetkit/argentMobile";
import { WebWalletConnector } from "starknetkit/webwallet";
import { Chain, mainnet, sepolia } from "@starknet-react/chains";
import { StarknetConfig, blastProvider, jsonRpcProvider } from "@starknet-react/core";
import { ReactNode } from "react";
 
export default function StarknetProvider({ children }: { children: ReactNode }) {
  const defaultChain = process.env.NEXT_PUBLIC_DEFAULT_CHAIN;
  const chains = defaultChain === sepolia.network ? [sepolia, mainnet] : [mainnet, sepolia];
  const blastApiKey = process.env.NEXT_PUBLIC_BLAST_API_KEY;
  function rpc(chain: Chain) {
    console.info("Using RPC for chain:", chain.network);
    return {
      nodeUrl:`https://blastapi.io/public-api/starknet`
    }
  }
 
const publicProvider = jsonRpcProvider({ rpc });
 
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
      provider={blastApiKey ? blastProvider({ apiKey: blastApiKey }) : publicProvider}
      connectors={connectors}
      autoConnect={true}
    >
      {children}
    </StarknetConfig>
  )
}