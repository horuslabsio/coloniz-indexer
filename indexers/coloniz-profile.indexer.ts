import { defineIndexer } from "@apibara/indexer";
import { useLogger } from "@apibara/indexer/plugins";
import { drizzleStorage, useDrizzleStorage } from "@apibara/plugin-drizzle";
import { decodeEvent, StarknetStream } from "@apibara/starknet";
import type { ApibaraRuntimeConfig } from "apibara/types";
import { getDrizzlePgDatabase } from "../lib/db";
import { hash } from "starknet";
import { coloniz_ColonizProfile } from "abis";
import { profiles } from "lib/schema";

// Define event selectors
const CREATED_PROFILE = hash.getSelectorFromName("CreatedProfile") as `0x${string}`;

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
                        CREATED_PROFILE,
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
                    case CREATED_PROFILE:
                        decodedEvent = decodeEvent({
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