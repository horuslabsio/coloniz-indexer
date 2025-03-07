import { defineIndexer } from "@apibara/indexer";
import { useLogger } from "@apibara/indexer/plugins";
import { drizzleStorage, useDrizzleStorage } from "@apibara/plugin-drizzle";
import { StarknetStream } from "@apibara/starknet";
import type { ApibaraRuntimeConfig } from "apibara/types";
import { hash } from "starknet";
import { handleJolted, handleJoltRequested, handleJoltFullfilled } from "./handlers/jolt.handlers";

// Define event selectors from contracts.ts
const JOLTED = hash.getSelectorFromName("Jolted") as `0x${string}`;
const JOLT_REQUESTED = hash.getSelectorFromName("JoltRequested") as `0x${string}`;
const JOLT_FULLFILLED = hash.getSelectorFromName("JoltRequestFullfilled") as `0x${string}`;

export default function (runtimeConfig: ApibaraRuntimeConfig) {
    const indexerId = "colonizIndexer";
    const { startingBlock, streamUrl, postgresConnectionString, colonizHubContractAddress } =
        runtimeConfig[indexerId];
    const { db } = useDrizzleStorage();

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
                        JOLTED,
                        JOLT_REQUESTED,
                        JOLT_FULLFILLED
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

                switch (eventKey) {
                    case JOLTED:
                        await handleJolted(event, db);
                        break;

                    case JOLT_REQUESTED:
                        await handleJoltRequested(event, db);
                        break;

                    case JOLT_FULLFILLED:
                        await handleJoltFullfilled(event, db);
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
