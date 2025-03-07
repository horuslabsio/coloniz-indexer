import { defineIndexer } from "@apibara/indexer";
import { useLogger } from "@apibara/indexer/plugins";
import { drizzleStorage, useDrizzleStorage } from "@apibara/plugin-drizzle";
import { StarknetStream } from "@apibara/starknet";
import type { ApibaraRuntimeConfig } from "apibara/types";
import { hash } from "starknet";
import { handleProfileCreated } from "lib/handlers/profile.handlers";
import {
    handleChannelCreated,
    handleJoinedChannel,
    handleLeftChannel,
    handleChannelModAdded,
    handleChannelModRemoved,
    handleChannelBanStatusUpdated
} from "lib/handlers/channel.handlers";

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
} from "lib/handlers/community.handlers";

import { handleMinted, handleBurnt, handleLinked, handleUnlinked } from "lib/handlers/handle.handlers";
import { handleJolted, handleJoltRequested, handleJoltFullfilled } from "lib/handlers/jolt.handlers";
import { handleFollowed, handleUnfollowed, handleFollowerBlocked, handleFollowerUnblocked } from "lib/handlers/useraction.handlers";
import { getDrizzlePgDatabase } from "lib/db";

// Define useraction event selectors
const FOLLOWED = hash.getSelectorFromName("Followed") as `0x${string}`;
const UNFOLLOWED = hash.getSelectorFromName("Unfollowed") as `0x${string}`;
const FOLLOWER_BLOCKED = hash.getSelectorFromName("FollowerBlocked") as `0x${string}`;
const FOLLOWER_UNBLOCKED = hash.getSelectorFromName("FollowerUnblocked") as `0x${string}`;

// Define jolt event selectors
const JOLTED = hash.getSelectorFromName("Jolted") as `0x${string}`;
const JOLT_REQUESTED = hash.getSelectorFromName("JoltRequested") as `0x${string}`;
const JOLT_FULLFILLED = hash.getSelectorFromName("JoltRequestFullfilled") as `0x${string}`;

// Define handle event selectors
const HANDLE_MINTED = hash.getSelectorFromName("HandleMinted") as `0x${string}`;
const HANDLE_BURNT = hash.getSelectorFromName("HandleBurnt") as `0x${string}`;
const HANDLE_LINKED = hash.getSelectorFromName("HandleLinked") as `0x${string}`;
const HANDLE_UNLINKED = hash.getSelectorFromName("HandleUnlinked") as `0x${string}`;

// Define community event selectors
const COMMUNITY_CREATED = hash.getSelectorFromName("CommunityCreated") as `0x${string}`;
const JOINED_COMMUNITY = hash.getSelectorFromName("JoinedCommunity") as `0x${string}`;
const LEFT_COMMUNITY = hash.getSelectorFromName("LeftCommunity") as `0x${string}`;
const COMMUNITY_MOD_ADDED = hash.getSelectorFromName("CommunityModAdded") as `0x${string}`;
const COMMUNITY_MOD_REMOVED = hash.getSelectorFromName("CommunityModRemoved") as `0x${string}`;
const COMMUNITY_BAN_STATUS_UPDATED = hash.getSelectorFromName("CommunityBanStatusUpdated") as `0x${string}`;
const COMMUNITY_UPGRADED = hash.getSelectorFromName("CommunityUpgraded") as `0x${string}`;
const COMMUNITY_GATE_KEEPED = hash.getSelectorFromName("CommunityGatekeeped") as `0x${string}`;
const DEPLOYED_COMMUNITY_NFT = hash.getSelectorFromName("DeployedCommunityNft") as `0x${string}`;

// Define channel event selectors
const CHANNEL_CREATED = hash.getSelectorFromName("ChannelCreated") as `0x${string}`;
const JOINED_CHANNEL = hash.getSelectorFromName("JoinedChannel") as `0x${string}`;
const LEFT_CHANNEL = hash.getSelectorFromName("LeftChannel") as `0x${string}`;
const CHANNEL_MOD_ADDED = hash.getSelectorFromName("ChannelModAdded") as `0x${string}`;
const CHANNEL_MOD_REMOVED = hash.getSelectorFromName("ChannelModRemoved") as `0x${string}`;
const CHANNEL_BAN_STATUS_UPDATED = hash.getSelectorFromName("ChannelBanStatusUpdated") as `0x${string}`;

// Define profile event selectors
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
                        COMMUNITY_CREATED,
                        JOINED_COMMUNITY,
                        LEFT_COMMUNITY,
                        COMMUNITY_MOD_ADDED,
                        COMMUNITY_MOD_REMOVED,
                        COMMUNITY_BAN_STATUS_UPDATED,
                        COMMUNITY_UPGRADED,
                        COMMUNITY_GATE_KEEPED,
                        DEPLOYED_COMMUNITY_NFT,
                        CHANNEL_CREATED,
                        JOINED_CHANNEL,
                        LEFT_CHANNEL,
                        CHANNEL_MOD_ADDED,
                        CHANNEL_MOD_REMOVED,
                        CHANNEL_BAN_STATUS_UPDATED,
                    ],
                },
            ],
        },
        plugins: [drizzleStorage({ db, persistState: true })],

        async transform({ endCursor, finality, block }) {
            const logger = useLogger();
            const { events, header } = block;

            if (events.length === 0) {
                logger.log(`No events found in block ${header?.blockNumber}`);
                return;
            }

            for (const event of events) {
                const eventKey = event.keys[0];
                const { db } = useDrizzleStorage();

                switch (eventKey) {
                    case CREATED_PROFILE:
                        await handleProfileCreated(event, db);
                        break;
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
                    case HANDLE_MINTED:
                        await handleMinted(event, db);
                        break;
                    case HANDLE_BURNT:
                        await handleBurnt(event, db);
                        break;
                    case HANDLE_LINKED:
                        await handleLinked(event, db);
                        break;
                    case HANDLE_UNLINKED:
                        await handleUnlinked(event, db);
                        break;
                    case JOLTED:
                        await handleJolted(event, db);
                        break;
                    case JOLT_REQUESTED:
                        await handleJoltRequested(event, db);
                        break;
                    case JOLT_FULLFILLED:
                        await handleJoltFullfilled(event, db);
                        break;
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