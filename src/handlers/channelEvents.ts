import { DataSource } from 'typeorm';
import { type ChannelCreatedEvent, type ChannelMemberEvent, type ChannelModEvent, type ChannelBanEvent } from '../processors/channels';

export async function handleChannelCreated(
    event: ChannelCreatedEvent,
    db: DataSource
): Promise<void> {
    const { channelId, communityId, channelOwner, timestamp } = event;

    await db
        .createQueryBuilder()
        .insert()
        .into('channels')
        .values({
            channel_id: channelId,
            community_id: communityId,
            channel_owner: channelOwner,
            created_timestamp: timestamp,
        })
        .orIgnore()
        .execute();
}

export async function handleChannelMemberJoined(
    event: ChannelMemberEvent,
    db: DataSource
): Promise<void> {
    const { channelId, profile, executor, timestamp } = event;

    await db
        .createQueryBuilder()
        .insert()
        .into('channel_members')
        .values({
            channel_id: channelId,
            profile_address: profile,
            executor,
            timestamp,
        })
        .orUpdate(
            ['executor', 'timestamp'],
            ['channel_id', 'profile_address'],
        )
        .execute();
}

export async function handleChannelMemberLeft(
    event: ChannelMemberEvent,
    db: DataSource
): Promise<void> {
    const { channelId, profile } = event;

    await db
        .createQueryBuilder()
        .delete()
        .from('channel_members')
        .where('channel_id = :channelId AND profile_address = :profile', {
            channelId,
            profile,
        })
        .execute();
}

export async function handleChannelModAdded(
    event: ChannelModEvent,
    db: DataSource
): Promise<void> {
    const { channelId, profile, executor, timestamp } = event;

    await db
        .createQueryBuilder()
        .insert()
        .into('channel_mods')
        .values({
            channel_id: channelId,
            profile_address: profile,
            executor,
            timestamp,
        })
        .orUpdate(
            ['executor', 'timestamp'],
            ['channel_id', 'profile_address'],
        )
        .execute();
}

export async function handleChannelModRemoved(
    event: ChannelModEvent,
    db: DataSource
): Promise<void> {
    const { channelId, profile } = event;

    await db
        .createQueryBuilder()
        .delete()
        .from('channel_mods')
        .where('channel_id = :channelId AND profile_address = :profile', {
            channelId,
            profile,
        })
        .execute();
}

export async function handleChannelBanStatusUpdated(
    event: ChannelBanEvent,
    db: DataSource
): Promise<void> {
    const { channelId, profile, executor, timestamp, isBanned } = event;

    if (isBanned) {
        await db
            .createQueryBuilder()
            .insert()
            .into('channel_banned_members')
            .values({
                channel_id: channelId,
                profile_address: profile,
                executor,
                timestamp,
            })
            .orUpdate(
                ['executor', 'timestamp'],
                ['channel_id', 'profile_address'],
            )
            .execute();
    } else {
        await db
            .createQueryBuilder()
            .delete()
            .from('channel_banned_members')
            .where('channel_id = :channelId AND profile_address = :profile', {
                channelId,
                profile,
            })
            .execute();
    }
}
