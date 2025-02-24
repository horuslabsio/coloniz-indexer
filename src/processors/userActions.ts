import {
  FieldElement,
  v1alpha2 as starknet,
} from "@apibara/starknet";
import { processUint256, toHex, toNumber } from "../../new/utils.js";
import Long from "long";

interface BaseUserActionEvent {
  followId: number;
  timestamp: number;
}

export interface FollowEvent extends BaseUserActionEvent {
  follower: string;
  followed: string;
}

export interface UnfollowEvent extends BaseUserActionEvent {
  unfollower: string;
  unfollowed: string;
}

export interface BlockEvent extends BaseUserActionEvent {
  blocker: string;
  blocked: string;
}

export interface UnblockEvent extends BaseUserActionEvent {
  blocker: string;
  blocked: string;
}

export function processFollowEvent(event: starknet.IEvent): FollowEvent {
  const data = event.data;
  if (!data) throw new Error("Processor: Expected event with data");
  return {
    followed: toHex(FieldElement.toBigInt(data[0]).toString(16)),
    follower: toHex(FieldElement.toBigInt(data[1]).toString(16)),
    followId: processUint256(data, 2, 3),
    timestamp: toNumber(Long.fromBigInt(FieldElement.toBigInt(data[4]))),
  };
}

export function processUnfollowEvent(event: starknet.IEvent): UnfollowEvent {
  const data = event.data;
  if (!data) throw new Error("Processor: Expected event with data");
  return {
    unfollowed: toHex(FieldElement.toBigInt(data[0]).toString(16)),
    unfollower: toHex(FieldElement.toBigInt(data[1]).toString(16)),
    followId: processUint256(data, 2, 3),
    timestamp: toNumber(Long.fromBigInt(FieldElement.toBigInt(data[4]))),
  };
}

export function processBlockEvent(event: starknet.IEvent): BlockEvent {
  const data = event.data;
  if (!data) throw new Error("Processor: Expected event with data");
  return {
    blocker: toHex(FieldElement.toBigInt(data[0]).toString(16)),
    blocked: toHex(FieldElement.toBigInt(data[1]).toString(16)),
    followId: processUint256(data, 2, 3),
    timestamp: toNumber(Long.fromBigInt(FieldElement.toBigInt(data[2]))),
  };
}

export function processUnblockEvent(event: starknet.IEvent): UnblockEvent {
  const data = event.data;
  if (!data) throw new Error("Processor: Expected event with data");
  return {
    blocker: toHex(FieldElement.toBigInt(data[0]).toString(16)),
    blocked: toHex(FieldElement.toBigInt(data[1]).toString(16)),
    followId: processUint256(data, 2, 3),
    timestamp: toNumber(Long.fromBigInt(FieldElement.toBigInt(data[2]))),
  };
}
