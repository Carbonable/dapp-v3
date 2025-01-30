export type ProjectView = 'all' | 'my-projects' ;

export type VintageStatus = {
  variant: {
    Audited?: undefined;
    Confirmed?: undefined;
    Projected?: Record<string, never>;
    Unset?: undefined;
  };
};

export type Vintage = {
  created: bigint;
  failed: bigint;
  supply: bigint;
  year: bigint;
  status: VintageStatus;
};

export interface OffsetData {
  amount: bigint;
  filled: bigint;
  project_address: bigint;
  vintage: bigint;
  tx_hash: bigint;
  timestamp: bigint;
}

export type OffsetMetrics = {
  requested: bigint;
  fulfilled: bigint;
};