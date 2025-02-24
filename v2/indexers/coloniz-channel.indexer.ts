import { defineIndexer } from "@apibara/indexer";
import { useLogger } from "@apibara/indexer/plugins";
import { drizzleStorage, useDrizzleStorage } from "@apibara/plugin-drizzle";
import { decodeEvent, StarknetStream } from "@apibara/starknet";
import type { ApibaraRuntimeConfig } from "apibara/types";
import { getDrizzlePgDatabase } from "../lib/db";
import { hash } from "starknet";
import { coloniz_ColonizChannel } from "abis";
import { channels, channelMembers, channelMods, channelBannedMembers } from "lib/schema";
import { eq, and } from "drizzle-orm";

// Define event selectors
const CHANNEL_CREATED = hash.getSelectorFromName("ChannelCreated") as `0x${string}`;
const JOINED_CHANNEL = hash.getSelectorFromName("JoinedChannel") as `0x${string}`;
const LEFT_CHANNEL = hash.getSelectorFromName("LeftChannel") as `0x${string}`;
const CHANNEL_MOD_ADDED = hash.getSelectorFromName("ChannelModAdded") as `0x${string}`;
const CHANNEL_MOD_REMOVED = hash.getSelectorFromName("ChannelModRemoved") as `0x${string}`;
const CHANNEL_BAN_STATUS_UPDATED = hash.getSelectorFromName("ChannelBanStatusUpdated") as `0x${string}`;

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
                        CHANNEL_CREATED,
                        JOINED_CHANNEL,
                        LEFT_CHANNEL,
                        CHANNEL_MOD_ADDED,
                        CHANNEL_MOD_REMOVED,
                        CHANNEL_BAN_STATUS_UPDATED
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
                logger.log(`No events found in block ${header?.blockNumber}`);
                return;
            }

            for (const event of events) {
                const eventKey = event.keys[0];
                let decodedEvent;

                switch (eventKey) {
                    case CHANNEL_CREATED:
                        decodedEvent = decodeEvent({
                            abi: coloniz_ColonizChannel,
                            eventName: "coloniz::channel::channel::ChannelComponent::ChannelCreated",
                            event: event,
                        });

                        const { channel_id, community_id, channel_owner, block_timestamp } = decodedEvent.args;

                        await db.insert(channels).values({
                            channelId: Number(decodedEvent.args.channel_id),
                            communityId: Number(decodedEvent.args.community_id),
                            channelOwner: String(decodedEvent.args.channel_owner),
                            createdTimestamp: Number(decodedEvent.args.block_timestamp),
                        }).onConflictDoUpdate({
                            target: channels.channelId,
                            set: {
                                communityId: Number(decodedEvent.args.community_id),
                                channelOwner: String(decodedEvent.args.channel_owner),
                                createdTimestamp: Number(decodedEvent.args.block_timestamp),
                            }
                        });
                        break;

                    case JOINED_CHANNEL:
                        decodedEvent = decodeEvent({
                            abi: coloniz_ColonizChannel,
                            eventName: "coloniz::channel::channel::ChannelComponent::JoinedChannel",
                            event: event,
                        });

                        const existingMember = await db
                            .select()
                            .from(channelMembers)
                            .where(
                                and(
                                    eq(channelMembers.channelId, Number(decodedEvent.args.channel_id)),
                                    eq(channelMembers.profileAddress, String(decodedEvent.args.profile))
                                )
                            )
                            .limit(1);

                        if (existingMember.length > 0) {
                            await db.update(channelMembers)
                                .set({
                                    executor: String(decodedEvent.args.transaction_executor),
                                    timestamp: Number(decodedEvent.args.block_timestamp)
                                })
                                .where(
                                    and(
                                        eq(channelMembers.channelId, Number(decodedEvent.args.channel_id)),
                                        eq(channelMembers.profileAddress, String(decodedEvent.args.profile))
                                    )
                                );
                        } else {
                            await db.insert(channelMembers).values({
                                channelId: Number(decodedEvent.args.channel_id),
                                profileAddress: String(decodedEvent.args.profile),
                                executor: String(decodedEvent.args.transaction_executor),
                                timestamp: Number(decodedEvent.args.block_timestamp)
                            });
                        }
                        break;

                    case LEFT_CHANNEL:
                        decodedEvent = decodeEvent({
                            abi: coloniz_ColonizChannel,
                            eventName: "coloniz::channel::channel::ChannelComponent::LeftChannel",
                            event: event,
                        });

                        await db.delete(channelMembers)
                            .where(
                                and(
                                    eq(channelMembers.channelId, Number(decodedEvent.args.channel_id)),
                                    eq(channelMembers.profileAddress, String(decodedEvent.args.profile))
                                )
                            );
                        break;

                    case CHANNEL_MOD_ADDED:
                        decodedEvent = decodeEvent({
                            abi: coloniz_ColonizChannel,
                            eventName: "coloniz::channel::channel::ChannelComponent::ChannelModAdded",
                            event: event,
                        });

                        const existingMod = await db
                            .select()
                            .from(channelMods)
                            .where(
                                and(
                                    eq(channelMods.channelId, Number(decodedEvent.args.channel_id)),
                                    eq(channelMods.profileAddress, String(decodedEvent.args.mod_address))
                                )
                            )
                            .limit(1);

                        if (existingMod.length > 0) {
                            await db.update(channelMods)
                                .set({
                                    executor: String(decodedEvent.args.transaction_executor),
                                    timestamp: Number(decodedEvent.args.block_timestamp)
                                })
                                .where(
                                    and(
                                        eq(channelMods.channelId, Number(decodedEvent.args.channel_id)),
                                        eq(channelMods.profileAddress, String(decodedEvent.args.mod_address))
                                    )
                                );
                        } else {
                            await db.insert(channelMods).values({
                                channelId: Number(decodedEvent.args.channel_id),
                                profileAddress: String(decodedEvent.args.mod_address),
                                executor: String(decodedEvent.args.transaction_executor),
                                timestamp: Number(decodedEvent.args.block_timestamp)
                            });
                        }
                        break;

                    case CHANNEL_MOD_REMOVED:
                        decodedEvent = decodeEvent({
                            abi: coloniz_ColonizChannel,
                            eventName: "coloniz::channel::channel::ChannelComponent::ChannelModRemoved",
                            event: event,
                        });

                        await db.delete(channelMods)
                            .where(
                                and(
                                    eq(channelMods.channelId, Number(decodedEvent.args.channel_id)),
                                    eq(channelMods.profileAddress, String(decodedEvent.args.mod_address))
                                )
                            );
                        break;

                    case CHANNEL_BAN_STATUS_UPDATED:
                        decodedEvent = decodeEvent({
                            abi: coloniz_ColonizChannel,
                            eventName: "coloniz::channel::channel::ChannelComponent::ChannelBanStatusUpdated",
                            event: event,
                        });

                        const isBanned = Boolean(decodedEvent.args.ban_status);

                        if (isBanned) {
                            const existingBan = await db
                                .select()
                                .from(channelBannedMembers)
                                .where(
                                    and(
                                        eq(channelBannedMembers.channelId, Number(decodedEvent.args.channel_id)),
                                        eq(channelBannedMembers.profileAddress, String(decodedEvent.args.profile))
                                    )
                                )
                                .limit(1);

                            if (existingBan.length > 0) {
                                await db.update(channelBannedMembers)
                                    .set({
                                        executor: String(decodedEvent.args.transaction_executor),
                                        timestamp: Number(decodedEvent.args.block_timestamp)
                                    })
                                    .where(
                                        and(
                                            eq(channelBannedMembers.channelId, Number(decodedEvent.args.channel_id)),
                                            eq(channelBannedMembers.profileAddress, String(decodedEvent.args.profile))
                                        )
                                    );
                            } else {
                                await db.insert(channelBannedMembers).values({
                                    channelId: Number(decodedEvent.args.channel_id),
                                    profileAddress: String(decodedEvent.args.profile),
                                    executor: String(decodedEvent.args.transaction_executor),
                                    timestamp: Number(decodedEvent.args.block_timestamp)
                                });
                            }
                        } else {
                            await db.delete(channelBannedMembers)
                                .where(
                                    and(
                                        eq(channelBannedMembers.channelId, Number(decodedEvent.args.channel_id)),
                                        eq(channelBannedMembers.profileAddress, String(decodedEvent.args.profile))
                                    )
                                );
                        }
                        break;

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