import {
  FieldElement,
  v1alpha2 as starknet,
} from "@apibara/starknet";
import { processUint256, toHex, toNumber } from "../../new/utils.js";
import Long from "long";

interface BaseCommunityEvent {
  communityId: number;
  timestamp: number;
}

export interface CommunityCreatedEvent extends BaseCommunityEvent {
  communityOwner: string;
  communityNftAddress: string;
}

export interface CommunityMemberEvent extends BaseCommunityEvent {
  profile: string;
  tokenId: number;
  executor: string;
}

export interface CommunityModEvent extends BaseCommunityEvent {
  profile: string;
  executor: string;
}

export interface CommunityBanEvent extends BaseCommunityEvent {
  profile: string;
  executor: string;
  isBanned: boolean;
}

export interface CommunityUpgradeEvent extends BaseCommunityEvent {
  executor: string;
  premiumType: string;
}

export interface CommunityGateKeepEvent extends BaseCommunityEvent {
  executor: string;
  gateKeepType: string;
}

export interface CommunityNftEvent extends BaseCommunityEvent {
  communityNft: string;
}

export function processCommunityCreatedEvent(
  event: starknet.IEvent,
): CommunityCreatedEvent {
  const data = event.data;
  if (!data) throw new Error("Processor: Expected event with data");
  return {
    communityId: processUint256(data, 0, 1),
    communityOwner: toHex(FieldElement.toBigInt(data[2]).toString(16)),
    communityNftAddress: toHex(FieldElement.toBigInt(data[3]).toString(16)),
    timestamp: toNumber(Long.fromBigInt(FieldElement.toBigInt(data[4]))),
  };
}

export function processCommunityMemberEvent(
  event: starknet.IEvent,
): CommunityMemberEvent {
  const data = event.data;
  if (!data) throw new Error("Processor: Expected event with data");
  return {
    communityId: processUint256(data, 0, 1),
    profile: toHex(FieldElement.toBigInt(data[2]).toString(16)),
    tokenId: processUint256(data, 3, 4),
    executor: toHex(FieldElement.toBigInt(data[5]).toString(16)),
    timestamp: toNumber(Long.fromBigInt(FieldElement.toBigInt(data[6]))),
  };
}

export function processCommunityModEvent(
  event: starknet.IEvent,
): CommunityModEvent {
  const data = event.data;
  if (!data) throw new Error("Processor: Expected event with data");
  return {
    communityId: processUint256(data, 0, 1),
    profile: toHex(FieldElement.toBigInt(data[3]).toString(16)),
    executor: toHex(FieldElement.toBigInt(data[2]).toString(16)),
    timestamp: toNumber(Long.fromBigInt(FieldElement.toBigInt(data[4]))),
  };
}

export function processCommunityBanEvent(
  event: starknet.IEvent,
): CommunityBanEvent {
  const data = event.data;
  if (!data) throw new Error("Processor: Expected event with data");
  return {
    communityId: processUint256(data, 0, 1),
    profile: toHex(FieldElement.toBigInt(data[3]).toString(16)),
    executor: toHex(FieldElement.toBigInt(data[2]).toString(16)),
    isBanned: Boolean(FieldElement.toBigInt(data[4])),
    timestamp: toNumber(Long.fromBigInt(FieldElement.toBigInt(data[5]))),
  };
}

export function processCommunityUpgradeEvent(
  event: starknet.IEvent,
): CommunityUpgradeEvent {
  const data = event.data;
  if (!data) throw new Error("Processor: Expected event with data");
  return {
    communityId: processUint256(data, 0, 1),
    executor: toHex(FieldElement.toBigInt(data[2]).toString(16)),
    premiumType: FieldElement.toBigInt(data[3]).toString(),
    timestamp: toNumber(Long.fromBigInt(FieldElement.toBigInt(data[4]))),
  };
}

export function processCommunityGateKeepEvent(
  event: starknet.IEvent,
): CommunityGateKeepEvent {
  const data = event.data;
  if (!data) throw new Error("Processor: Expected event with data");
  return {
    communityId: processUint256(data, 0, 1),
    executor: toHex(FieldElement.toBigInt(data[2]).toString(16)),
    gateKeepType: FieldElement.toBigInt(data[3]).toString(),
    timestamp: toNumber(Long.fromBigInt(FieldElement.toBigInt(data[4]))),
  };
}

export function processCommunityNftEvent(
  event: starknet.IEvent,
): CommunityNftEvent {
  const data = event.data;
  if (!data) throw new Error("Processor: Expected event with data");
  return {
    communityId: processUint256(data, 0, 1),
    communityNft: toHex(FieldElement.toBigInt(data[2]).toString(16)),
    timestamp: toNumber(Long.fromBigInt(FieldElement.toBigInt(data[3]))),
  };
}
