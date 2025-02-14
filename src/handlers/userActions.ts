import { DataSource } from 'typeorm';
import { type FollowEvent, type UnfollowEvent, type BlockEvent, type UnblockEvent } from '../processors/userActions';

export enum FollowStatus {
    following = 'following',
    unfollowed = 'unfollowed',
}

export async function handleFollowEvent(
    event: FollowEvent,
    db: DataSource
): Promise<void> {
    const { follower, followed, followId, timestamp } = event;

    await db
        .createQueryBuilder()
        .insert()
        .into('follows')
        .values({
            follower_address: follower,
            followed_address: followed,
            follow_id: followId,
            follow_timestamp: timestamp,
            status: FollowStatus.following,
        })
        .orUpdate(
            ['status', 'follow_timestamp'],
            ['follower_address', 'followed_address'],
        )
        .execute();
}

export async function handleUnfollowEvent(
    event: UnfollowEvent,
    db: DataSource
): Promise<void> {
    const { unfollower, unfollowed, timestamp } = event;

    await db
        .createQueryBuilder()
        .update('follows')
        .set({
            status: FollowStatus.unfollowed,
            unfollow_timestamp: timestamp,
        })
        .where('follower_address = :unfollower AND followed_address = :unfollowed', {
            unfollower,
            unfollowed,
        })
        .execute();
}

export async function handleBlockEvent(
    event: BlockEvent,
    db: DataSource
): Promise<void> {
    const { blocker, blocked, timestamp } = event;

    await db
        .createQueryBuilder()
        .insert()
        .into('blocks')
        .values({
            blocker_address: blocker,
            blocked_address: blocked,
            block_timestamp: timestamp,
            is_blocked: true,
        })
        .orUpdate(
            ['is_blocked', 'block_timestamp'],
            ['blocker_address', 'blocked_address'],
        )
        .execute();
}

export async function handleUnblockEvent(
    event: UnblockEvent,
    db: DataSource
): Promise<void> {
    const { blocker, blocked, timestamp } = event;

    await db
        .createQueryBuilder()
        .update('blocks')
        .set({
            is_blocked: false,
            unblock_timestamp: timestamp,
        })
        .where('blocker_address = :blocker AND blocked_address = :blocked', {
            blocker,
            blocked,
        })
        .execute();
}
