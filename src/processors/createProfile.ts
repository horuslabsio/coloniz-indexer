import { FieldElement, v1alpha2 as starknet } from '@apibara/starknet';
import { toHex, toBigInt, toNumber } from '../../utils';
import Long from 'long';

export interface CreateProfileEvent {
    profileAddress: string;
    owner: string;
    tokenId: number;
    timestamp: number;
}

export function processCreateProfileEvent(event: starknet.IEvent): CreateProfileEvent {
    if (!event || !event.data || !event.keys)
        throw new Error('Processor: Expected event with data and keys');
    const keys = event.keys;
    const data = event.data;

    return {
        profileAddress: toHex(FieldElement.toBigInt(keys[3]).toString(16)),
        owner: toHex(FieldElement.toBigInt(keys[2]).toString(16)),
        tokenId: toNumber(
            Long.fromBits(
                Number(FieldElement.toBigInt(data[0])),
                Number(FieldElement.toBigInt(data[1])),
            )
        ),
        timestamp: toNumber(Long.fromBigInt(FieldElement.toBigInt(data[2]))),
    };
}
