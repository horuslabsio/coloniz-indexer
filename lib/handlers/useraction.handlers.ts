import { decodeEvent } from "@apibara/starknet";
import { coloniz_Follow } from "abis";
import { follows, blocks } from "lib/schema";
import { eq, and } from "drizzle-orm";
import type { PgDatabase } from "drizzle-orm/pg-core";

export async function handleFollowed(event: any, db: PgDatabase<any, any, any>) {
    const decodedEvent = decodeEvent({
        abi: coloniz_Follow,
        eventName: "coloniz::follownft::follownft::Follow::Followed",
        event: event,
    });

    await db.insert(follows).values({
        followerProfileAddress: String(decodedEvent.args.follower_address),
        followedProfileAddress: String(decodedEvent.args.followed_address),
        followId: Number(decodedEvent.args.follow_id),
        followTimestamp: Number(decodedEvent.args.timestamp),
        status: "followed"
    });
}

export async function handleUnfollowed(event: any, db: PgDatabase<any, any, any>) {
    const decodedEvent = decodeEvent({
        abi: coloniz_Follow,
        eventName: "coloniz::follownft::follownft::Follow::Unfollowed",
        event: event,
    });

    await db.delete(follows)
        .where(
            and(
                eq(follows.followerProfileAddress, String(decodedEvent.args.unfollower_address)),
                eq(follows.followedProfileAddress, String(decodedEvent.args.unfollowed_address))
            )
        );
}

export async function handleFollowerBlocked(event: any, db: PgDatabase<any, any, any>) {
    const decodedEvent = decodeEvent({
        abi: coloniz_Follow,
        eventName: "coloniz::follownft::follownft::Follow::FollowerBlocked",
        event: event,
    });

    await db.insert(blocks).values({
        blockerProfileAddress: String(decodedEvent.args.followed_address),
        blockedProfileAddress: String(decodedEvent.args.blocked_follower),
        blockTimestamp: Number(decodedEvent.args.timestamp)
    });
}

export async function handleFollowerUnblocked(event: any, db: PgDatabase<any, any, any>) {
    const decodedEvent = decodeEvent({
        abi: coloniz_Follow,
        eventName: "coloniz::follownft::follownft::Follow::FollowerUnblocked",
        event: event,
    });

    await db.delete(blocks)
        .where(
            and(
                eq(blocks.blockerProfileAddress, String(decodedEvent.args.followed_address)),
                eq(blocks.blockedProfileAddress, String(decodedEvent.args.unblocked_follower))
            )
        );
}
