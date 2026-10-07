import { InjectedConnector } from "starknetkit/injected";
import { ArgentMobileConnector, isInArgentMobileAppBrowser } from "starknetkit/argentMobile";
import { WebWalletConnector } from "starknetkit/webwallet";
import { Chain, mainnet, sepolia } from "@starknet-react/chains";
import { StarknetConfig, jsonRpcProvider } from "@starknet-react/core";
import { BlockTag } from "starknet";
import { ReactNode } from "react";
 
// Next.js inlines only literal process.env.NEXT_PUBLIC_* reads, hence one read per variable.
// A missing or malformed value throws while the module loads, which fails `next build` during
// prerendering: without it starknet.js would silently fall back to its own default public node
// (a NetworkName such as "SN_MAIN" in place of the URL triggers that fallback too).
// The messages never include the value: the mainnet URL carries the gateway key.
const MAINNET_RPC_URL = requireRpcUrl("NEXT_PUBLIC_MAINNET_RPC_URL", process.env.NEXT_PUBLIC_MAINNET_RPC_URL);
const SEPOLIA_RPC_URL = requireRpcUrl("NEXT_PUBLIC_SEPOLIA_RPC_URL", process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL);
const DEFAULT_CHAIN = requireDefaultChain(process.env.NEXT_PUBLIC_DEFAULT_CHAIN);

function requireRpcUrl(name: string, value: string | undefined): string {
  if (value && isHttpUrl(value)) return value;
  throw new Error(`${name} must hold the http(s) URL of the Starknet JSON-RPC node of that network at build time`);
}

function isHttpUrl(value: string): boolean {
  try {
    return ["https:", "http:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}

function requireDefaultChain(value: string | undefined): Chain {
  if (value === mainnet.network) return mainnet;
  if (value === sepolia.network) return sepolia;
  throw new Error(`NEXT_PUBLIC_DEFAULT_CHAIN must be "${mainnet.network}" or "${sepolia.network}" at build time`);
}

// The RPC gateway answers 429 when a limit is reached, for example when two visitors load a page in the
// same second: wait (with jitter, so the visitors do not retry together) and send the request again.
// starknet.js cannot see the status (it only fails to parse the text/plain body), hence this wrapper.
// Only reads go through this provider (the wallet sends the transactions), so a retry duplicates nothing.
const RETRY_DELAYS_MS = [250, 500, 1000];

async function fetchRetryingOn429(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  for (const delay of RETRY_DELAYS_MS) {
    const response = await fetch(input, init);
    if (response.status !== 429) return response;
    await new Promise((resolve) => setTimeout(resolve, delay + Math.random() * delay));
  }
  return fetch(input, init);
}

export default function StarknetProvider({ children }: { children: ReactNode }) {
  const chains = DEFAULT_CHAIN === sepolia ? [sepolia, mainnet] : [mainnet, sepolia];
  function rpc(chain: Chain) {
    if (chain.id === mainnet.id) return { nodeUrl: MAINNET_RPC_URL, blockIdentifier: BlockTag.LATEST, baseFetch: fetchRetryingOn429 };
    if (chain.id === sepolia.id) return { nodeUrl: SEPOLIA_RPC_URL, blockIdentifier: BlockTag.LATEST, baseFetch: fetchRetryingOn429 };
    return null;
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
      provider={publicProvider}
      connectors={connectors}
      autoConnect={true}
    >
      {children}
    </StarknetConfig>
  )
}