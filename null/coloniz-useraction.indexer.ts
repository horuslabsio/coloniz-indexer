import { defineIndexer } from "@apibara/indexer";
import { useLogger } from "@apibara/indexer/plugins";
import { drizzleStorage, useDrizzleStorage } from "@apibara/plugin-drizzle";
import { StarknetStream } from "@apibara/starknet";
import type { ApibaraRuntimeConfig } from "apibara/types";
import { hash } from "starknet";
import { handleFollowed, handleUnfollowed, handleFollowerBlocked, handleFollowerUnblocked } from "../lib/handlers/useraction.handlers";
import { getDrizzlePgDatabase } from "lib/db";

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
            const { events, header } = block;

            if (events.length === 0) {
                // logger.log(`No events found in block ${header?.blockNumber}`);
                return;
            }

            for (const event of events) {
                const eventKey = event.keys[0];
                const { db } = useDrizzleStorage();

                switch (eventKey) {
                    case FOLLOWED:
                        await handleFollowed(event, db);
                        break;

                    case UNFOLLOWED:
                        await handleUnfollowed(event, db);
                        break;

                    case FOLLOWER_BLOCKED:
                        await handleFollowerBlocked(event, db);
                        break;

                    case FOLLOWER_UNBLOCKED:
                        await handleFollowerUnblocked(event, db);
                        break;

                    default:
                        // logger.log(`Unknown event key: ${eventKey}`);
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
