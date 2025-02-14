import { v1alpha2 } from "@apibara/starknet";

// Generic event processor result
export interface IEventProcessorResult {
  [key: string]: string | number | bigint | boolean;
}

// Generic event processor type
export type EventProcessor<T extends IEventProcessorResult> = (
  event: v1alpha2.IEvent,
) => T;

// Contract info structure
export interface IContractInfo {
  address: string;
  protocol: string;
  metadata?: Record<string, any>;
}

// Contract configuration by class hash
export interface IContractsByClasshash {
  classhash: string;
  event_keys: string[];
  processor: EventProcessor<IEventProcessorResult>;
  contracts: IContractInfo[];
}

// Main contracts configuration
export interface IContracts {
  [key: string]: IContractsByClasshash;
}
