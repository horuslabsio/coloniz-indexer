import { decodeEvent } from "@apibara/starknet";
import { coloniz_ColonizChannel, coloniz_ColonizCommunity } from "abis";
import { communities, communityMembers, communityMods, communityBannedMembers, communityUpgrades, communityGateKeeps } from "lib/schema";
import { eq, and } from "drizzle-orm";
import type { PgDatabase } from "drizzle-orm/pg-core";

export async function handleCommunityCreated(event: any, db: PgDatabase<any, any, any>) {
    const decodedEvent = decodeEvent({
        abi: coloniz_ColonizCommunity,
        eventName: "coloniz::community::community::CommunityComponent::CommunityCreated",
        event: event,
    });

    const { community_id, community_owner, community_nft_address, block_timestamp } = decodedEvent.args;

    await db.insert(communities).values({
        communityId: Number(community_id),
        communityOwner: String(community_owner),
        communityNftAddress: String(community_nft_address),
        createdTimestamp: Number(block_timestamp),
        totalNumberOfPosts: 0
    }).onConflictDoUpdate({
        target: communities.communityId,
        set: {
            communityOwner: String(community_owner),
            communityNftAddress: String(community_nft_address),
            createdTimestamp: Number(block_timestamp)
        }
    });
}

export async function handleJoinedCommunity(event: any, db: PgDatabase<any, any, any>) {
    const decodedEvent = decodeEvent({
        abi: coloniz_ColonizCommunity,
        eventName: "coloniz::community::community::CommunityComponent::JoinedCommunity",
        event: event,
    });

    const { community_id, profile, block_timestamp, transaction_executor, token_id } = decodedEvent.args;

    await db.insert(communityMembers).values({
        communityId: Number(community_id),
        profileAddress: String(profile),
        timestamp: Number(block_timestamp),
        tokenId: Number(token_id),
        executor: String(transaction_executor)
    });
}

export async function handleLeftCommunity(event: any, db: PgDatabase<any, any, any>) {
    const decodedEvent = decodeEvent({
        abi: coloniz_ColonizCommunity,
        eventName: "coloniz::community::community::CommunityComponent::LeftCommunity",
        event: event,
    });

    const { community_id, profile } = decodedEvent.args;

    await db.delete(communityMembers).where(
        and(
            eq(communityMembers.communityId, Number(community_id)),
            eq(communityMembers.profileAddress, String(profile))
        )
    );
}

export async function handleCommunityModAdded(event: any, db: PgDatabase<any, any, any>) {
    const decodedEvent = decodeEvent({
        abi: coloniz_ColonizCommunity,
        eventName: "coloniz::community::community::CommunityComponent::CommunityModAdded",
        event: event,
    });

    const { community_id, mod_address, block_timestamp, transaction_executor } = decodedEvent.args;

    await db.insert(communityMods).values({
        communityId: Number(community_id),
        profileAddress: String(mod_address),
        timestamp: Number(block_timestamp),
        executor: String(transaction_executor)
    });
}

export async function handleCommunityModRemoved(event: any, db: PgDatabase<any, any, any>) {
    const decodedEvent = decodeEvent({
        abi: coloniz_ColonizCommunity,
        eventName: "coloniz::community::community::CommunityComponent::CommunityModRemoved",
        event: event,
    });

    const { community_id, mod_address } = decodedEvent.args;

    await db.delete(communityMods).where(
        and(
            eq(communityMods.communityId, Number(community_id)),
            eq(communityMods.profileAddress, String(mod_address))
        )
    );
}

export async function handleCommunityBanStatusUpdated(event: any, db: PgDatabase<any, any, any>) {
    const decodedEvent = decodeEvent({
        abi: coloniz_ColonizCommunity,
        eventName: "coloniz::community::community::CommunityComponent::CommunityBanStatusUpdated",
        event: event,
    });

    const { community_id, profile, ban_status, block_timestamp, transaction_executor } = decodedEvent.args;

    if (ban_status) {
        await db.insert(communityBannedMembers).values({
            communityId: Number(community_id),
            profileAddress: String(profile),
            timestamp: Number(block_timestamp),
            executor: String(transaction_executor)
        });
    } else {
        await db.delete(communityBannedMembers).where(
            and(
                eq(communityBannedMembers.communityId, Number(community_id)),
                eq(communityBannedMembers.profileAddress, String(profile))
            )
        );
    }
}

export async function handleCommunityUpgraded(event: any, db: PgDatabase<any, any, any>) {
    const decodedEvent = decodeEvent({
        abi: coloniz_ColonizCommunity,
        eventName: "coloniz::community::community::CommunityComponent::CommunityUpgraded",
        event: event,
    });

    const { community_id, premiumType, block_timestamp, transaction_executor } = decodedEvent.args;

    // await db.insert(communityUpgrades).values({
    //     communityId: Number(community_id),
    //     upgradeType: String(upgrade_type),
    //     timestamp: Number(block_timestamp),
    //     executor: String(transaction_executor),
    // });

    await db.update(communities)
        .set({
            premiumType: String(premiumType) as "Free" | "Business" | "Premium"
        })
        .where(eq(communities.communityId, Number(community_id)));
}

export async function handleCommunityGatekeeped(event: any, db: PgDatabase<any, any, any>) {
    const decodedEvent = decodeEvent({
        abi: coloniz_ColonizCommunity,
        eventName: "coloniz::community::community::CommunityComponent::CommunityGatekeeped",
        event: event,
    });

    const { community_id, gatekeepType, block_timestamp, transaction_executor } = decodedEvent.args;

    // await db.insert(communityGateKeeps).values({
    //     communityId: Number(community_id),
    //     gateType: String(gatekeepType),
    //     timestamp: Number(block_timestamp),
    //     executor: String(transaction_executor)
    // });

    await db.update(communities)
        .set({
            gateKeepType: String(gatekeepType) as "None" | "Token" | "NFT"
        })
        .where(eq(communities.communityId, Number(community_id)));
}

export async function handleDeployedCommunityNft(event: any, db: PgDatabase<any, any, any>) {
    const decodedEvent = decodeEvent({
        abi: coloniz_ColonizChannel,
        eventName: "coloniz::community::community::CommunityComponent::DeployedCommunityNFT",
        event: event,
    });

    const { community_id, community_nft } = decodedEvent.args;

    await db.update(communities)
        .set({
            communityNftAddress: String(community_nft)
        })
        .where(eq(communities.communityId, Number(community_id)));
} 