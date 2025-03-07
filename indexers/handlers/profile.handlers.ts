import { decodeEvent } from "@apibara/starknet";
import { coloniz_ColonizProfile } from "abis";
import { profiles } from "lib/schema";
import type { PgDatabase } from "drizzle-orm/pg-core";

export async function handleProfileCreated(event: any, db: PgDatabase<any, any, any>) {
    const decodedEvent = decodeEvent({
        abi: coloniz_ColonizProfile,
        eventName: "coloniz::profile::profile::ProfileComponent::CreatedProfile",
        event: event,
    });

    const { owner, profile_address, token_id, timestamp } = decodedEvent.args;

    await db.insert(profiles).values({
        profileOwner: owner,
        profileAddress: profile_address,
        tokenId: Number(token_id),
        createdAt: Number(timestamp),
        pubCount: 0,
    }).onConflictDoUpdate({
        target: profiles.profileAddress,
        set: {
            profileOwner: owner,
            tokenId: Number(token_id),
            createdAt: Number(timestamp)
        },
    });
} 