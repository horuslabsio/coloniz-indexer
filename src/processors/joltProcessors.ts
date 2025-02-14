import { FieldElement, v1alpha2 as starknet } from "@apibara/starknet";
import { processUint256, toHex, toNumber } from "../../utils.ts";
import Long from "long";

export enum JoltType {
  Transfer = "transfer",
  Request = "request",
}

export interface JoltEvent {
  joltId: number;
  joltType: string;
  sender: string;
  amount: number;
  recipient: string;
  timestamp: number;
}

export function processJoltEvent(event: starknet.IEvent): JoltEvent {
  const data = event.data;
  if (!data) throw new Error("Processor: Expected event with data");
  return {
    joltId: processUint256(data, 0, 1),
    joltType: FieldElement.toBigInt(data[2]).toString(),
    sender: toHex(FieldElement.toBigInt(data[3]).toString(16)),
    amount: processUint256(data, 4, 5),
    recipient: toHex(FieldElement.toBigInt(data[6]).toString(16)),
    timestamp: toNumber(Long.fromBigInt(FieldElement.toBigInt(data[7]))),
  };
}

export function processJoltRequestEvent(event: starknet.IEvent): JoltEvent {
  const data = event.data;
  if (!data) throw new Error("Processor: Expected event with data");
  return {
    joltId: processUint256(data, 0, 1),
    joltType: JoltType.Request,
    sender: toHex(FieldElement.toBigInt(data[3]).toString(16)),
    amount: processUint256(data, 4, 5),
    recipient: toHex(FieldElement.toBigInt(data[6]).toString(16)),
    timestamp: toNumber(Long.fromBigInt(FieldElement.toBigInt(data[7]))),
  };
}

export function processJoltFulfillmentEvent(
  event: starknet.IEvent,
): { joltId: number } {
  const data = event.data;
  if (!data) throw new Error("Processor: Expected event with data");
  return {
    joltId: processUint256(data, 0, 1),
  };
}
