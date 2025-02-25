/* eslint-disable @next/next/no-img-element */
import { minifyAddressOrStarknetId } from "@/utils/starknet";
import { useAccount, useStarkProfile } from "@starknet-react/core";
import { useMemo } from "react";

export default function Address() {
  const { address } = useAccount();
  const { data } = useStarkProfile({ address });

  const starknetId = useMemo(() => {
    if (data !== undefined) {
        return data.name;
    }

    return address;
  }, [address, data]);

  const pfp = useMemo(() => {
    if (data !== undefined && data.profile?.startsWith('data:application/json;base64,')) {
        const profileData = data.profile.split(",")[1].slice(0, -1);
        const profile = JSON.parse(window.atob(profileData));
        return profile.image;
    }

    if (data !== undefined && data.profilePicture !== undefined) {
        return data.profilePicture;
    }

    return null;
  }, [data]);

  return (
    <div className="flex items-center">
      {pfp && <img className="w-8 h-8 mr-3 rounded-full" src={pfp} alt="PFP" /> }
      <div>{minifyAddressOrStarknetId(address, starknetId)}</div>
    </div>
  )
}