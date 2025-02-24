import { defineIndexer } from "@apibara/indexer";
import { useLogger } from "@apibara/indexer/plugins";
import { drizzleStorage, useDrizzleStorage } from "@apibara/plugin-drizzle";
import { decodeEvent, StarknetStream } from "@apibara/starknet";
import type { ApibaraRuntimeConfig } from "apibara/types";
import { getDrizzlePgDatabase } from "../lib/db";
import { hash } from "starknet";
import { coloniz_Follow } from "abis";
import { follows, blocks } from "lib/schema";
import { eq, and } from "drizzle-orm";

// Define event selectors from contracts.ts
const FOLLOWED = hash.getSelectorFromName("Followed") as `0x${string}`;
const UNFOLLOWED = hash.getSelectorFromName("Unfollowed") as `0x${string}`;
const FOLLOWER_BLOCKED = hash.getSelectorFromName("FollowerBlocked") as `0x${string}`;
const FOLLOWER_UNBLOCKED = hash.getSelectorFromName("FollowerUnblocked") as `0x${string}`;

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
                        FOLLOWED,
                        UNFOLLOWED,
                        FOLLOWER_BLOCKED,
                        FOLLOWER_UNBLOCKED
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
                    case FOLLOWED:
                        decodedEvent = decodeEvent({
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
                        break;

                    case UNFOLLOWED:
                        decodedEvent = decodeEvent({
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
                        break;

                    case FOLLOWER_BLOCKED:
                        decodedEvent = decodeEvent({
                            abi: coloniz_Follow,
                            eventName: "coloniz::follownft::follownft::Follow::FollowerBlocked",
                            event: event,
                        });

                        await db.insert(blocks).values({
                            blockerProfileAddress: String(decodedEvent.args.followed_address),
                            blockedProfileAddress: String(decodedEvent.args.blocked_follower),
                            blockTimestamp: Number(decodedEvent.args.timestamp)
                        });
                        break;

                    case FOLLOWER_UNBLOCKED:
                        decodedEvent = decodeEvent({
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
