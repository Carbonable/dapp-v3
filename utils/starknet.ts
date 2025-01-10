export function minifyAddressOrStarknetId(address: string | undefined, starknetId: string | undefined): string {
  const input = starknetId !== undefined ? starknetId : address;
  if (input === undefined) { return ""; }

  return input.length > 24 ? `${input.substring(0, 7)} ... ${input.substring(input.length - 7, input.length)}` : input;
}

export function convertToBigIntArray(balances: unknown): bigint[] {
  if (Array.isArray(balances)) {
    return balances.map(balance => {
      try {
        return BigInt(balance.toString());
      } catch {
        console.error('Failed to convert balance to BigInt:', balance);
        return BigInt(0);
      }
    });
  }
  try {
    return [BigInt(balances?.toString() || '0')];
  } catch {
    console.error('Failed to convert single balance to BigInt:', balances);
    return [BigInt(0)];
  }
};