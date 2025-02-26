import { defineIndexer } from "@apibara/indexer";
import { useLogger } from "@apibara/indexer/plugins";
import { drizzleStorage, useDrizzleStorage } from "@apibara/plugin-drizzle";
import { decodeEvent, StarknetStream } from "@apibara/starknet";
import type { ApibaraRuntimeConfig } from "apibara/types";
import { getDrizzlePgDatabase } from "../lib/db";
import { hash } from "starknet";
import { coloniz_Jolt } from "abis";
import { jolts } from "lib/schema";
import { eq } from "drizzle-orm";

// Define event selectors from contracts.ts
const JOLTED = hash.getSelectorFromName("Jolted") as `0x${string}`;
const JOLT_REQUESTED = hash.getSelectorFromName("JoltRequested") as `0x${string}`;
const JOLT_FULLFILLED = hash.getSelectorFromName("JoltRequestFullfilled") as `0x${string}`;

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
                    case JOLTED:
                        decodedEvent = decodeEvent({
                            abi: coloniz_Jolt,
                            eventName: "coloniz::jolt::jolt::JoltComponent::Jolted",
                            event: event,
                        });

                        await db.insert(jolts).values({
                            joltId: Number(decodedEvent.args.jolt_id),
                            joltType: String(decodedEvent.args.jolt_type),
                            // amount: Number(decodedEvent.args.amount),
                            createdTimestamp: Number(decodedEvent.args.block_timestamp),
                            sender: String(decodedEvent.args.sender),
                            recipient: String(decodedEvent.args.recipient)
                        });
                        break;

                    case JOLT_REQUESTED:
                        decodedEvent = decodeEvent({
                            abi: coloniz_Jolt,
                            eventName: "coloniz::jolt::jolt::JoltComponent::JoltRequested",
                            event: event,
                        });

                        await db.insert(jolts).values({
                            joltId: Number(decodedEvent.args.jolt_id),
                            joltType: String(decodedEvent.args.jolt_type),
                            // amount: Number(decodedEvent.args.amount),
                            createdTimestamp: Number(decodedEvent.args.block_timestamp),
                            sender: String(decodedEvent.args.sender),
                            recipient: String(decodedEvent.args.recipient)
                        });
                        break;

                    case JOLT_FULLFILLED:
                        decodedEvent = decodeEvent({
                            abi: coloniz_Jolt,
                            eventName: "coloniz::jolt::jolt::JoltComponent::JoltRequestFullfilled",
                            event: event,
                        });

                        await db.update(jolts)
                            .set({
                                joltType: String(decodedEvent.args.jolt_type),
                                // amount: Number(decodedEvent.args.amount),
                                sender: String(decodedEvent.args.sender),
                                recipient: String(decodedEvent.args.recipient)
                            })
                            .where(eq(jolts.joltId, Number(decodedEvent.args.jolt_id)));
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
