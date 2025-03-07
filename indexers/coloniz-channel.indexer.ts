import { defineIndexer } from "@apibara/indexer";
import { useLogger } from "@apibara/indexer/plugins";
import { drizzleStorage, useDrizzleStorage } from "@apibara/plugin-drizzle";
import { StarknetStream } from "@apibara/starknet";
import type { ApibaraRuntimeConfig } from "apibara/types";
import { getDrizzlePgDatabase } from "../lib/db";
import { hash } from "starknet";
import {
    handleChannelCreated,
    handleJoinedChannel,
    handleLeftChannel,
    handleChannelModAdded,
    handleChannelModRemoved,
    handleChannelBanStatusUpdated
} from "./handlers/channel.handlers";

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
            const { events, header } = block;

            if (events.length === 0) {
                // logger.log(`No events found in block ${header?.blockNumber}`);
                return;
            }

            for (const event of events) {
                const eventKey = event.keys[0];

                switch (eventKey) {
                    case CHANNEL_CREATED:
                        await handleChannelCreated(event, db);
                        break;
                    case JOINED_CHANNEL:
                        await handleJoinedChannel(event, db);
                        break;
                    case LEFT_CHANNEL:
                        await handleLeftChannel(event, db);
                        break;
                    case CHANNEL_MOD_ADDED:
                        await handleChannelModAdded(event, db);
                        break;
                    case CHANNEL_MOD_REMOVED:
                        await handleChannelModRemoved(event, db);
                        break;
                    case CHANNEL_BAN_STATUS_UPDATED:
                        await handleChannelBanStatusUpdated(event, db);
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