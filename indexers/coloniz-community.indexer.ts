import { defineIndexer } from "@apibara/indexer";
import { useLogger } from "@apibara/indexer/plugins";
import { drizzleStorage, useDrizzleStorage } from "@apibara/plugin-drizzle";
import { decodeEvent, StarknetStream } from "@apibara/starknet";
import type { ApibaraRuntimeConfig } from "apibara/types";
import { getDrizzlePgDatabase } from "../lib/db";
import { hash } from "starknet";
import { coloniz_ColonizCommunity } from "abis";
import { communities, communityMembers, communityMods, communityBannedMembers, communityUpgrades, communityGateKeeps } from "lib/schema";
import { eq, and } from "drizzle-orm";

// Define event selectors
const COMMUNITY_CREATED = hash.getSelectorFromName("CommunityCreated") as `0x${string}`;
const JOINED_COMMUNITY = hash.getSelectorFromName("JoinedCommunity") as `0x${string}`;
const LEFT_COMMUNITY = hash.getSelectorFromName("LeftCommunity") as `0x${string}`;
const COMMUNITY_MOD_ADDED = hash.getSelectorFromName("CommunityModAdded") as `0x${string}`;
const COMMUNITY_MOD_REMOVED = hash.getSelectorFromName("CommunityModRemoved") as `0x${string}`;
const COMMUNITY_BAN_STATUS_UPDATED = hash.getSelectorFromName("CommunityBanStatusUpdated") as `0x${string}`;
const COMMUNITY_UPGRADED = hash.getSelectorFromName("CommunityUpgraded") as `0x${string}`;
const COMMUNITY_GATE_KEEPED = hash.getSelectorFromName("CommunityGatekeeped") as `0x${string}`;
const DEPLOYED_COMMUNITY_NFT = hash.getSelectorFromName("DeployedCommunityNft") as `0x${string}`;

export default function (runtimeConfig: ApibaraRuntimeConfig) {
    const indexerId = "colonizIndexer";
    const { startingBlock, streamUrl, postgresConnectionString, colonizHubContractAddress } =
        runtimeConfig[indexerId];
    const { db } = getDrizzlePgDatabase(postgresConnectionString);

    return defineIndexer(StarknetStream)({
        streamUrl,
        finality: "accepted",
        startingBlock: BigInt(startingBlock),
        filter: {
            header: "always",
            events: [
                {
                    address: colonizHubContractAddress as `0x${string}`,
                    keys: [
                        COMMUNITY_CREATED,
                        JOINED_COMMUNITY,
                        LEFT_COMMUNITY,
                        COMMUNITY_MOD_ADDED,
                        COMMUNITY_MOD_REMOVED,
                        COMMUNITY_BAN_STATUS_UPDATED,
                        COMMUNITY_UPGRADED,
                        COMMUNITY_GATE_KEEPED,
                        DEPLOYED_COMMUNITY_NFT
                    ],
                },
            ],
        },
        plugins: [drizzleStorage({ db, persistState: true })],

        async transform({ endCursor, finality, block }) {
            const logger = useLogger();
            const { db } = useDrizzleStorage();
            const { events, header } = block;

            if (events.length === 0) {
                // logger.log(`No events found in block ${header?.blockNumber}`);
                return;
            }

            for (const event of events) {
                const eventKey = event.keys[0];
                let decodedEvent;

                switch (eventKey) {
                    case COMMUNITY_CREATED:
                        decodedEvent = decodeEvent({
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
                        }).onConflictDoUpdate({
                            target: communities.communityId,
                            set: {
                                communityOwner: String(community_owner),
                                communityNftAddress: String(community_nft_address),
                                createdTimestamp: Number(block_timestamp),
                            }
                        });
                        break;

                    case COMMUNITY_UPGRADED:
                        decodedEvent = decodeEvent({
                            abi: coloniz_ColonizCommunity,
                            eventName: "coloniz::community::community::CommunityComponent::CommunityUpgraded",
                            event: event,
                        });


                        await db.insert(communityUpgrades).values({
                            communityId: Number(decodedEvent.args.community_id),
                            profileAddress: String(decodedEvent.args.transaction_executor),
                            executor: String(decodedEvent.args.transaction_executor),
                            timestamp: Number(decodedEvent.args.block_timestamp),
                        });

                        await db.update(communities)
                            .set({
                                premiumType: decodedEvent.args.premiumType as unknown as 'Free' | 'Premium' | 'Business',
                            })
                            .where(eq(communities.communityId, Number(decodedEvent.args.community_id)));
                        break;

                    case COMMUNITY_GATE_KEEPED:
                        decodedEvent = decodeEvent({
                            abi: coloniz_ColonizCommunity,
                            eventName: "coloniz::community::community::CommunityComponent::CommunityGatekeeped",
                            event: event,
                        });

                        await db.insert(communityGateKeeps).values({
                            communityId: Number(decodedEvent.args.community_id),
                            profileAddress: String(decodedEvent.args.transaction_executor),
                            executor: String(decodedEvent.args.transaction_executor),
                            timestamp: Number(decodedEvent.args.block_timestamp),
                        });

                        await db.update(communities)
                            .set({
                                gateKeepType: decodedEvent.args.gatekeepType as unknown as 'None' | 'Token' | 'NFT',
                            })
                            .where(eq(communities.communityId, Number(decodedEvent.args.community_id)));
                        break;

                    case JOINED_COMMUNITY:
                        decodedEvent = decodeEvent({
                            abi: coloniz_ColonizCommunity,
                            eventName: "coloniz::community::community::CommunityComponent::JoinedCommunity",
                            event: event,
                        });

                        // Check if member already exists
                        const existingMember = await db
                            .select()
                            .from(communityMembers)
                            .where(
                                and(
                                    eq(communityMembers.communityId, Number(decodedEvent.args.community_id)),
                                    eq(communityMembers.profileAddress, String(decodedEvent.args.profile))
                                )
                            )
                            .limit(1);

                        if (existingMember.length > 0) {
                            // Update existing member
                            await db.update(communityMembers)
                                .set({
                                    tokenId: Number(decodedEvent.args.token_id),
                                    executor: String(decodedEvent.args.transaction_executor),
                                    timestamp: Number(decodedEvent.args.block_timestamp)
                                })
                                .where(
                                    and(
                                        eq(communityMembers.communityId, Number(decodedEvent.args.community_id)),
                                        eq(communityMembers.profileAddress, String(decodedEvent.args.profile))
                                    )
                                );
                        } else {
                            // Insert new member
                            await db.insert(communityMembers).values({
                                communityId: Number(decodedEvent.args.community_id),
                                profileAddress: String(decodedEvent.args.profile),
                                tokenId: Number(decodedEvent.args.token_id),
                                executor: String(decodedEvent.args.transaction_executor),
                                timestamp: Number(decodedEvent.args.block_timestamp)
                            });
                        }
                        break;

                    case LEFT_COMMUNITY:
                        decodedEvent = decodeEvent({
                            abi: coloniz_ColonizCommunity,
                            eventName: "coloniz::community::community::CommunityComponent::LeftCommunity",
                            event: event,
                        });

                        // Delete member
                        await db.delete(communityMembers)
                            .where(
                                and(
                                    eq(communityMembers.communityId, Number(decodedEvent.args.community_id)),
                                    eq(communityMembers.profileAddress, String(decodedEvent.args.profile))
                                )
                            );
                        break;

                    case COMMUNITY_MOD_ADDED:
                        decodedEvent = decodeEvent({
                            abi: coloniz_ColonizCommunity,
                            eventName: "coloniz::community::community::CommunityComponent::CommunityModAdded",
                            event: event,
                        });

                        // Check if mod already exists
                        const existingMod = await db.select()
                            .from(communityMods)
                            .where(
                                and(
                                    eq(communityMods.communityId, Number(decodedEvent.args.community_id)),
                                    eq(communityMods.profileAddress, String(decodedEvent.args.mod_address))
                                )
                            )
                            .limit(1);

                        if (existingMod.length > 0) {
                            // Update existing mod
                            await db.update(communityMods)
                                .set({
                                    executor: String(decodedEvent.args.transaction_executor),
                                    timestamp: Number(decodedEvent.args.block_timestamp)
                                })
                                .where(
                                    and(
                                        eq(communityMods.communityId, Number(decodedEvent.args.community_id)),
                                        eq(communityMods.profileAddress, String(decodedEvent.args.mod_address))
                                    )
                                );
                        } else {
                            // Insert new mod
                            await db.insert(communityMods).values({
                                communityId: Number(decodedEvent.args.community_id),
                                profileAddress: String(decodedEvent.args.mod_address),
                                executor: String(decodedEvent.args.transaction_executor),
                                timestamp: Number(decodedEvent.args.block_timestamp)
                            });
                        }
                        break;

                    case COMMUNITY_MOD_REMOVED:
                        decodedEvent = decodeEvent({
                            abi: coloniz_ColonizCommunity,
                            eventName: "coloniz::community::community::CommunityComponent::CommunityModRemoved",
                            event: event,
                        });

                        // Delete mod
                        await db.delete(communityMods)
                            .where(
                                and(
                                    eq(communityMods.communityId, Number(decodedEvent.args.community_id)),
                                    eq(communityMods.profileAddress, String(decodedEvent.args.mod_address))
                                )
                            );
                        break;

                    case COMMUNITY_BAN_STATUS_UPDATED:
                        decodedEvent = decodeEvent({
                            abi: coloniz_ColonizCommunity,
                            eventName: "coloniz::community::community::CommunityComponent::CommunityBanStatusUpdated",
                            event: event,
                        });

                        const isBanned = Boolean(decodedEvent.args.ban_status);

                        if (isBanned) {
                            // Check if ban record already exists
                            const existingBan = await db.select()
                                .from(communityBannedMembers)
                                .where(
                                    and(
                                        eq(communityBannedMembers.communityId, Number(decodedEvent.args.community_id)),
                                        eq(communityBannedMembers.profileAddress, String(decodedEvent.args.profile))
                                    )
                                )
                                .limit(1);

                            if (existingBan.length > 0) {
                                // Update existing ban
                                await db.update(communityBannedMembers)
                                    .set({
                                        executor: String(decodedEvent.args.transaction_executor),
                                        timestamp: Number(decodedEvent.args.block_timestamp)
                                    })
                                    .where(
                                        and(
                                            eq(communityBannedMembers.communityId, Number(decodedEvent.args.community_id)),
                                            eq(communityBannedMembers.profileAddress, String(decodedEvent.args.profile))
                                        )
                                    );
                            } else {
                                // Insert new ban
                                await db.insert(communityBannedMembers).values({
                                    communityId: Number(decodedEvent.args.community_id),
                                    profileAddress: String(decodedEvent.args.profile),
                                    executor: String(decodedEvent.args.transaction_executor),
                                    timestamp: Number(decodedEvent.args.block_timestamp)
                                });
                            }
                        } else {
                            // Remove ban
                            await db.delete(communityBannedMembers)
                                .where(
                                    and(
                                        eq(communityBannedMembers.communityId, Number(decodedEvent.args.community_id)),
                                        eq(communityBannedMembers.profileAddress, String(decodedEvent.args.profile))
                                    )
                                );
                        }
                        break;

                    // case DEPLOYED_COMMUNITY_NFT:
                    //     decodedEvent = decodeEvent({
                    //         abi: coloniz_ColonizCommunity,
                    //         eventName: "coloniz::community::community::CommunityComponent::DeployedCommunityNft",
                    //         event: event,
                    //     });

                    //     await db.update(communities)
                    //         .set({
                    //             nftAddress: String(decodedEvent.args.community_nft),
                    //             updatedAt: Number(decodedEvent.args.block_timestamp)
                    //         })
                    //         .where(eq(communities.id, Number(decodedEvent.args.community_id)));
                    //     break;

                    default:
                        logger.log(`Unknown event key: ${eventKey}`);
                        break;
                }
            }

            logger.info(
                "Transforming block | orderKey: ",
                endCursor?.orderKey,
                " | finality: ",
                finality,
            );
        },
    });
}