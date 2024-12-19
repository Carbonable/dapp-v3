export function minifyAddressOrStarknetId(address: string | undefined, starknetId: string | undefined): string {
  const input = starknetId !== undefined ? starknetId : address;
  if (input === undefined) { return ""; }

  return input.length > 24 ? `${input.substring(0, 7)} ... ${input.substring(input.length - 7, input.length)}` : input;
}