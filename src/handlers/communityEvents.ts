import { DataSource } from 'typeorm';
import { type CommunityCreatedEvent, type CommunityMemberEvent, type CommunityModEvent, type CommunityBanEvent, type CommunityUpgradeEvent, type CommunityGateKeepEvent, type CommunityNftEvent } from '../processors/communityProcessors';

export enum PremiumType {
    Free = 'free',
    Standard = 'standard',
    Business = 'business',
}

export enum GateKeepType {
    None = 'none',
    NFTGating = 'nft_gating',
    PermissionedGating = 'permissioned_gating',
    PaidGating = 'paid_gating',
}

export async function handleCommunityCreated(
    event: CommunityCreatedEvent,
    db: DataSource
): Promise<void> {
    const { communityId, communityOwner, communityNftAddress, timestamp } = event;

    await db
        .createQueryBuilder()
        .insert()
        .into('communities')
        .values({
            community_id: communityId,
            community_owner: communityOwner,
            community_nft_address: communityNftAddress,
            created_timestamp: timestamp,
        })
        .orIgnore()
        .execute();
}

export async function handleCommunityMemberJoined(
    event: CommunityMemberEvent,
    db: DataSource
): Promise<void> {
    const { communityId, profile, tokenId, executor, timestamp } = event;

    await db
        .createQueryBuilder()
        .insert()
        .into('community_members')
        .values({
            community_id: communityId,
            profile_address: profile,
            token_id: tokenId,
            executor,
            timestamp,
        })
        .orUpdate(
            ['token_id', 'executor', 'timestamp'],
            ['community_id', 'profile_address'],
        )
        .execute();
}

export async function handleCommunityMemberLeft(
    event: CommunityMemberEvent,
    db: DataSource
): Promise<void> {
    const { communityId, profile } = event;

    await db
        .createQueryBuilder()
        .delete()
        .from('community_members')
        .where('community_id = :communityId AND profile_address = :profile', {
            communityId,
            profile,
        })
        .execute();
}

export async function handleCommunityModAdded(
    event: CommunityModEvent,
    db: DataSource
): Promise<void> {
    const { communityId, profile, executor, timestamp } = event;

    await db
        .createQueryBuilder()
        .insert()
        .into('community_mods')
        .values({
            community_id: communityId,
            profile_address: profile,
            executor,
            timestamp,
        })
        .orUpdate(
            ['executor', 'timestamp'],
            ['community_id', 'profile_address'],
        )
        .execute();
}

export async function handleCommunityModRemoved(
    event: CommunityModEvent,
    db: DataSource
): Promise<void> {
    const { communityId, profile } = event;

    await db
        .createQueryBuilder()
        .delete()
        .from('community_mods')
        .where('community_id = :communityId AND profile_address = :profile', {
            communityId,
            profile,
        })
        .execute();
}

export async function handleCommunityBanStatusUpdated(
    event: CommunityBanEvent,
    db: DataSource
): Promise<void> {
    const { communityId, profile, executor, timestamp, isBanned } = event;

    if (isBanned) {
        await db
            .createQueryBuilder()
            .insert()
            .into('community_banned_members')
            .values({
                community_id: communityId,
                profile_address: profile,
                executor,
                timestamp,
            })
            .orUpdate(
                ['executor', 'timestamp'],
                ['community_id', 'profile_address'],
            )
            .execute();
    } else {
        await db
            .createQueryBuilder()
            .delete()
            .from('community_banned_members')
            .where('community_id = :communityId AND profile_address = :profile', {
                communityId,
                profile,
            })
            .execute();
    }
}

export async function handleCommunityUpgraded(
    event: CommunityUpgradeEvent,
    db: DataSource
): Promise<void> {
    const { communityId, executor, timestamp, premiumType } = event;
    const premiumTypeMap = {
        '0': PremiumType.Free,
        '1': PremiumType.Standard,
        '2': PremiumType.Business,
    };

    await db
        .createQueryBuilder()
        .update('communities')
        .set({
            premium_type: premiumTypeMap[premiumType as keyof typeof premiumTypeMap],
            last_upgraded_at: timestamp,
            last_upgraded_by: executor,
        })
        .where('community_id = :communityId', { communityId })
        .execute();
}

export async function handleCommunityGateKeeped(
    event: CommunityGateKeepEvent,
    db: DataSource
): Promise<void> {
    const { communityId, executor, timestamp, gateKeepType } = event;
    const gateKeepTypeMap = {
        '0': GateKeepType.None,
        '1': GateKeepType.NFTGating,
        '2': GateKeepType.PermissionedGating,
        '3': GateKeepType.PaidGating,
    };

    await db
        .createQueryBuilder()
        .update('communities')
        .set({
            gate_keep_type: gateKeepTypeMap[gateKeepType as keyof typeof gateKeepTypeMap],
            last_gate_kept_at: timestamp,
            last_gate_kept_by: executor,
        })
        .where('community_id = :communityId', { communityId })
        .execute();
}

export async function handleCommunityNftDeployed(
    event: CommunityNftEvent,
    db: DataSource
): Promise<void> {
    const { communityId, communityNft, timestamp } = event;

    await db
        .createQueryBuilder()
        .update('communities')
        .set({
            community_nft_address: communityNft,
            nft_deployed_at: timestamp,
        })
        .where('community_id = :communityId', { communityId })
        .execute();
}
