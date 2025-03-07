import { defineIndexer } from "@apibara/indexer";
import { useLogger } from "@apibara/indexer/plugins";
import { drizzleStorage, useDrizzleStorage } from "@apibara/plugin-drizzle";
import { StarknetStream } from "@apibara/starknet";
import type { ApibaraRuntimeConfig } from "apibara/types";
import { hash } from "starknet";
import {
    handleCommunityCreated,
    handleJoinedCommunity,
    handleLeftCommunity,
    handleCommunityModAdded,
    handleCommunityModRemoved,
    handleCommunityBanStatusUpdated,
    handleCommunityUpgraded,
    handleCommunityGatekeeped,
    handleDeployedCommunityNft
} from "../lib/handlers/community.handlers";
import { getDrizzlePgDatabase } from "lib/db";

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
            const { events, header } = block;

            if (events.length === 0) {
                // logger.log(`No events found in block ${header?.blockNumber}`);
                return;
            }

            for (const event of events) {
                const eventKey = event.keys[0];
                const { db } = useDrizzleStorage();

                switch (eventKey) {
                    case COMMUNITY_CREATED:
                        await handleCommunityCreated(event, db);
                        break;
                    case JOINED_COMMUNITY:
                        await handleJoinedCommunity(event, db);
                        break;
                    case LEFT_COMMUNITY:
                        await handleLeftCommunity(event, db);
                        break;
                    case COMMUNITY_MOD_ADDED:
                        await handleCommunityModAdded(event, db);
                        break;
                    case COMMUNITY_MOD_REMOVED:
                        await handleCommunityModRemoved(event, db);
                        break;
                    case COMMUNITY_BAN_STATUS_UPDATED:
                        await handleCommunityBanStatusUpdated(event, db);
                        break;
                    case COMMUNITY_UPGRADED:
                        await handleCommunityUpgraded(event, db);
                        break;
                    case COMMUNITY_GATE_KEEPED:
                        await handleCommunityGatekeeped(event, db);
                        break;
                    case DEPLOYED_COMMUNITY_NFT:
                        await handleDeployedCommunityNft(event, db);
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