import { decodeEvent } from "@apibara/starknet";
import { coloniz_Jolt } from "abis";
import { jolts } from "lib/schema";
import { eq } from "drizzle-orm";
import type { PgDatabase } from "drizzle-orm/pg-core";

export async function handleJolted(event: any, db: PgDatabase<any, any, any>) {
    const decodedEvent = decodeEvent({
        abi: coloniz_Jolt,
        eventName: "coloniz::jolt::jolt::JoltComponent::Jolted",
        event: event,
    });

    await db.insert(jolts).values({
        joltId: Number(decodedEvent.args.jolt_id),
        joltType: String(decodedEvent.args.jolt_type),
        // amount: Number(decodedEvent.args.amount),
        createdTimestamp: Number(decodedEvent.args.block_timestamp),
        sender: String(decodedEvent.args.sender),
        recipient: String(decodedEvent.args.recipient)
    });
}

export async function handleJoltRequested(event: any, db: PgDatabase<any, any, any>) {
    const decodedEvent = decodeEvent({
        abi: coloniz_Jolt,
        eventName: "coloniz::jolt::jolt::JoltComponent::JoltRequested",
        event: event,
    });

    await db.insert(jolts).values({
        joltId: Number(decodedEvent.args.jolt_id),
        joltType: String(decodedEvent.args.jolt_type),
        // amount: Number(decodedEvent.args.amount),
        createdTimestamp: Number(decodedEvent.args.block_timestamp),
        sender: String(decodedEvent.args.sender),
        recipient: String(decodedEvent.args.recipient)
    });
}

export async function handleJoltFullfilled(event: any, db: PgDatabase<any, any, any>) {
    const decodedEvent = decodeEvent({
        abi: coloniz_Jolt,
        eventName: "coloniz::jolt::jolt::JoltComponent::JoltRequestFullfilled",
        event: event,
    });

    await db.update(jolts)
        .set({
            joltType: String(decodedEvent.args.jolt_type),
            // amount: Number(decodedEvent.args.amount),
            sender: String(decodedEvent.args.sender),
            recipient: String(decodedEvent.args.recipient)
        })
        .where(eq(jolts.joltId, Number(decodedEvent.args.jolt_id)));
} 