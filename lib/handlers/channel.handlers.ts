import { decodeEvent } from "@apibara/starknet";
import { coloniz_ColonizChannel } from "abis";
import { channels, channelMembers, channelMods, channelBannedMembers } from "lib/schema";
import { eq, and } from "drizzle-orm";
import type { PgDatabase } from "drizzle-orm/pg-core";

export async function handleChannelCreated(event: any, db: PgDatabase<any, any, any>) {
    const decodedEvent = decodeEvent({
        abi: coloniz_ColonizChannel,
        eventName: "coloniz::channel::channel::ChannelComponent::ChannelCreated",
        event: event,
    });

    const { channel_id, channel_owner, community_id, block_timestamp } = decodedEvent.args;

    await db.insert(channels).values({
        channelId: Number(channel_id),
        communityId: Number(community_id),
        channelOwner: String(channel_owner),
        createdTimestamp: Number(block_timestamp),
    }).onConflictDoUpdate({
        target: channels.channelId,
        set: {
            channelOwner: String(channel_owner),
            createdTimestamp: Number(block_timestamp),
        },
    });
}

export async function handleJoinedChannel(event: any, db: PgDatabase<any, any, any>) {
    const decodedEvent = decodeEvent({
        abi: coloniz_ColonizChannel,
        eventName: "coloniz::channel::channel::ChannelComponent::JoinedChannel",
        event: event,
    });

    const { channel_id, profile, block_timestamp, transaction_executor } = decodedEvent.args;

    await db.insert(channelMembers).values({
        channelId: Number(channel_id),
        profileAddress: String(profile),
        timestamp: Number(block_timestamp),
        executor: String(transaction_executor)
    });
}

export async function handleLeftChannel(event: any, db: PgDatabase<any, any, any>) {
    const decodedEvent = decodeEvent({
        abi: coloniz_ColonizChannel,
        eventName: "coloniz::channel::channel::ChannelComponent::LeftChannel",
        event: event,
    });

    const { channel_id, profile } = decodedEvent.args;

    await db.delete(channelMembers)
        .where(
            and(
                eq(channelMembers.channelId, Number(channel_id)),
                eq(channelMembers.profileAddress, String(profile))
            )
        );
}

export async function handleChannelModAdded(event: any, db: PgDatabase<any, any, any>) {
    const decodedEvent = decodeEvent({
        abi: coloniz_ColonizChannel,
        eventName: "coloniz::channel::channel::ChannelComponent::ChannelModAdded",
        event: event,
    });

    const { channel_id, mod_address, block_timestamp, transaction_executor } = decodedEvent.args;

    await db.insert(channelMods).values({
        channelId: Number(channel_id),
        profileAddress: String(mod_address),
        timestamp: Number(block_timestamp),
        executor: String(transaction_executor)
    });
}

export async function handleChannelModRemoved(event: any, db: PgDatabase<any, any, any>) {
    const decodedEvent = decodeEvent({
        abi: coloniz_ColonizChannel,
        eventName: "coloniz::channel::channel::ChannelComponent::ChannelModRemoved",
        event: event,
    });

    const { channel_id, mod_address } = decodedEvent.args;

    await db.delete(channelMods)
        .where(
            and(
                eq(channelMods.channelId, Number(channel_id)),
                eq(channelMods.profileAddress, String(mod_address))
            )
        );
}

export async function handleChannelBanStatusUpdated(event: any, db: PgDatabase<any, any, any>) {
    const decodedEvent = decodeEvent({
        abi: coloniz_ColonizChannel,
        eventName: "coloniz::channel::channel::ChannelComponent::ChannelBanStatusUpdated",
        event: event,
    });

    const { channel_id, profile, ban_status, block_timestamp, transaction_executor } = decodedEvent.args;

    if (ban_status) {
        await db.insert(channelBannedMembers).values({
            channelId: Number(channel_id),
            profileAddress: String(profile),
            timestamp: Number(block_timestamp),
            executor: String(transaction_executor)
        });
    } else {
        await db.delete(channelBannedMembers)
            .where(
                and(
                    eq(channelBannedMembers.channelId, Number(channel_id)),
                    eq(channelBannedMembers.profileAddress, String(profile))
                )
            );
    }
} 