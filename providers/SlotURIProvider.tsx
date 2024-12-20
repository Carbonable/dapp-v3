import { SlotURI } from "@/types/slotURI";
import { createContext, useContext, useEffect, useState } from "react";
import { shortString } from "starknet";
import { useProjectAbis } from "./ProjectAbiProvider";
import ProjectCardSkeleton from "@/components/portfolio/project/ProjectCardSkeleton";
import { useReadContract } from "@starknet-react/core";

const SlotURIContext = createContext<SlotURI>({} as SlotURI);
export default function SlotURIWrapper({ children }: { children: React.ReactNode }) {      
  const [slotUri, setSlotUri] = useState<SlotURI|undefined>(undefined);
  const { projectAbi, projectAddress } = useProjectAbis();

  const { data, isLoading, error } = useReadContract({
    address: projectAddress as `0x${string}`,
    abi: projectAbi,
    functionName: 'slot_uri',
    args: []
  });

  useEffect(() => {
    if (data === undefined) { return; }

    const array = data as Array<string>;

    array.shift();

    if (array.length > 0) {
    try {
      const cleanedString = array
        .map(shortString.decodeShortString)
        .join('')
        .replace("data:application/json,", "");
      const parsedData = JSON.parse(cleanedString);
      setSlotUri(parsedData);
    } catch (error) {
      console.error('Failed to parse JSON:', error);
    }
  }
  }, [data]);

  if (isLoading && slotUri === undefined)  {
    return (
      <ProjectCardSkeleton />
    )
  }

  if (error) {
    return (
      <div>Error: {error.message}</div>
    )
  }

  if (slotUri === undefined) { 
    return (
      <ProjectCardSkeleton />
    )
  }

  return (
    <SlotURIContext.Provider value={ slotUri }>
      { children }
    </SlotURIContext.Provider>
  );
}

export function useSlotURI() {
  return useContext(SlotURIContext);
}