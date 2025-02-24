import {
  FieldElement,
  v1alpha2 as starknet,
} from "@apibara/starknet";
import { processUint256, toHex, toNumber } from "../../utils.js";
import Long from "long";

export interface HandleEvent {
  tokenId: string;
  timestamp: number;
}

export interface HandleMintedEvent extends HandleEvent {
  localName: string;
  to: string;
}

export interface HandleBurnedEvent extends HandleEvent {
  localName: string;
  to: string;
}

export interface HandleLinkedEvent extends HandleEvent {
  profileAddress: string;
  caller: string;
}

export interface HandleUnlinkedEvent extends HandleEvent {
  profileAddress: string;
  caller: string;
}

export function processHandleMintedEvent(
  event: starknet.IEvent,
): HandleMintedEvent {
  const data = event.data;
  if (!data) throw new Error("Processor: Expected event with data");
  return {
    localName: FieldElement.toHex(data[0]),
    tokenId: processUint256(data, 1, 2).toString(),
    to: toHex(FieldElement.toBigInt(data[3]).toString(16)),
    timestamp: toNumber(
      Long.fromBigInt(FieldElement.toBigInt(data[data.length - 1])),
    ),
  };
}

export function processHandleBurnedEvent(
  event: starknet.IEvent,
): HandleBurnedEvent {
  const data = event.data;
  if (!data) throw new Error("Processor: Expected event with data");
  return {
    localName: FieldElement.toHex(data[0]),
    tokenId: processUint256(data, 1, 2).toString(),
    to: toHex(FieldElement.toBigInt(data[3]).toString(16)),
    timestamp: toNumber(
      Long.fromBigInt(FieldElement.toBigInt(data[data.length - 1])),
    ),
  };
}

export function processHandleLinkedEvent(
  event: starknet.IEvent,
): HandleLinkedEvent {
  const data = event.data;
  if (!data) throw new Error("Processor: Expected event with data");
  return {
    tokenId: processUint256(data, 0, 1).toString(),
    profileAddress: toHex(FieldElement.toBigInt(data[2]).toString(16)),
    caller: toHex(FieldElement.toBigInt(data[3]).toString(16)),
    timestamp: toNumber(
      Long.fromBigInt(FieldElement.toBigInt(data[data.length - 1])),
    ),
  };
}

export function processHandleUnlinkedEvent(
  event: starknet.IEvent,
): HandleUnlinkedEvent {
  const data = event.data;
  if (!data) throw new Error("Processor: Expected event with data");
  return {
    tokenId: processUint256(data, 0, 1).toString(),
    profileAddress: toHex(FieldElement.toBigInt(data[2]).toString(16)),
    caller: toHex(FieldElement.toBigInt(data[3]).toString(16)),
    timestamp: toNumber(
      Long.fromBigInt(FieldElement.toBigInt(data[data.length - 1])),
    ),
  };
}
