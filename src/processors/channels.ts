import {
  FieldElement,
  decodeEvent,
  v1alpha2 as starknet,
  Event
} from "@apibara/starknet";
import { processUint256, toHex, toNumber } from "../../new/utils.js";
import Long from "long";
import type { IEventProcessorResult } from "../../types.js";

interface BaseChannelEvent {
  channelId: number;
  timestamp: number;
}

export interface ChannelCreatedEvent extends BaseChannelEvent {
  communityId: number;
  channelOwner: string;
}

export interface ChannelMemberEvent extends BaseChannelEvent {
  profile: string;
  executor: string;
}

export interface ChannelModEvent extends BaseChannelEvent {
  profile: string;
  executor: string;
}

export interface ChannelBanEvent
  extends BaseChannelEvent, IEventProcessorResult {
  profile: string;
  executor: string;
  isBanned: boolean;
}

export function processChannelCreatedEvent(
  event: Event,
): ChannelCreatedEvent {
  const data = event.data;
  if (!data) throw new Error("Processor: Expected event with data");
  return {
    channelId: processUint256(data, 0, 1),
    communityId: processUint256(data, 2, 3),
    channelOwner: toHex(FieldElement.toBigInt(data[4]).toString(16)),
    timestamp: toNumber(Long.fromBigInt(FieldElement.toBigInt(data[5]))),
  };
}

export function processChannelMemberEvent(
  event: Event,
): ChannelMemberEvent {
  const data = event.data;
  if (!data) throw new Error("Processor: Expected event with data");
  return {
    channelId: processUint256(data, 0, 1),
    executor: toHex(FieldElement.toBigInt(data[2]).toString(16)),
    profile: toHex(FieldElement.toBigInt(data[3]).toString(16)),
    timestamp: toNumber(Long.fromBigInt(FieldElement.toBigInt(data[4]))),
  };
}

export function processChannelModEvent(
  event: Event,
): ChannelModEvent {
  const data = event.data;
  if (!data) throw new Error("Processor: Expected event with data");
  return {
    channelId: processUint256(data, 0, 1),
    executor: toHex(FieldElement.toBigInt(data[2]).toString(16)),
    profile: toHex(FieldElement.toBigInt(data[3]).toString(16)),
    timestamp: toNumber(Long.fromBigInt(FieldElement.toBigInt(data[4]))),
  };
}

export function processChannelBanEvent(
  event: Event,
): ChannelBanEvent {
  const data = event.data;
  if (!data) throw new Error("Processor: Expected event with data");
  return {
    channelId: processUint256(data, 0, 1),
    executor: toHex(FieldElement.toBigInt(data[2]).toString(16)),
    profile: toHex(FieldElement.toBigInt(data[3]).toString(16)),
    isBanned: Boolean(FieldElement.toBigInt(data[4])),
    timestamp: toNumber(Long.fromBigInt(FieldElement.toBigInt(data[5]))),
  };
}
