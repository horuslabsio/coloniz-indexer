import { FieldElement, v1alpha2 } from "@apibara/starknet";
import Contracts from './contracts';
import { toNumber } from "./utils";
import { hash } from "starknet";
import { initializeDatabase, AppDataSource } from "./src/database";
import { DataSource } from "typeorm";

// Import all processors
import {
    // Channel processors
    processChannelCreatedEvent,
    processChannelMemberEvent,
    processChannelModEvent,
    processChannelBanEvent,

    // Community processors
    processCommunityCreatedEvent,
    processCommunityMemberEvent,
    processCommunityModEvent,
    processCommunityBanEvent,
    processCommunityUpgradeEvent,
    processCommunityGateKeepEvent,
    processCommunityNftEvent,

    // Profile processors
    processCreateProfileEvent,

    // Handle processors
    processHandleMintedEvent,
    processHandleBurnedEvent,
    processHandleLinkedEvent,
    processHandleUnlinkedEvent,

    // Jolt processors
    processJoltEvent,
    processJoltRequestEvent,
    processJoltFulfillmentEvent,

    // User action processors
    processFollowEvent,
    processUnfollowEvent,
    processBlockEvent,
    processUnblockEvent,
} from './src/processors';

// Import all handlers
import {
    // Channel events handlers
    handleChannelCreated,
    handleChannelMemberJoined,
    handleChannelMemberLeft,
    handleChannelModAdded,
    handleChannelModRemoved,
    handleChannelBanStatusUpdated,

    // Community events handlers
    handleCommunityCreated,
    handleCommunityMemberJoined,
    handleCommunityMemberLeft,
    handleCommunityModAdded,
    handleCommunityModRemoved,
    handleCommunityBanStatusUpdated,
    handleCommunityUpgraded,
    handleCommunityGateKeeped,
    handleCommunityNftDeployed,

    // Jolt events handlers
    handleJoltEvent,
    handleJoltRequestEvent,
    handleJoltFulfillmentEvent,

    // Profile events handlers
    handleCreateProfile,

    // Handle events handlers
    handleMintedEvent,
    handleBurnedEvent,
    handleLinkedEvent,
    handleUnlinkedEvent,

    // User actions handlers
    handleFollowEvent,
    handleUnfollowEvent,
    handleBlockEvent,
    handleUnblockEvent,
} from './src/handlers';

// Create processor map
const EventProcessors = {
    // Handle events
    [hash.getSelectorFromName(Contracts.events.HANDLE_MINTED)]: processHandleMintedEvent,
    [hash.getSelectorFromName(Contracts.events.HANDLE_BURNT)]: processHandleBurnedEvent,
    [hash.getSelectorFromName(Contracts.events.HANDLE_LINKED)]: processHandleLinkedEvent,
    [hash.getSelectorFromName(Contracts.events.HANDLE_UNLINKED)]: processHandleUnlinkedEvent,

    // Profile events
    [hash.getSelectorFromName(Contracts.events.PROFILE_CREATED)]: processCreateProfileEvent,

    // Jolt events
    [hash.getSelectorFromName(Contracts.events.JOLTED)]: processJoltEvent,
    [hash.getSelectorFromName(Contracts.events.JOLT_REQUESTED)]: processJoltRequestEvent,
    [hash.getSelectorFromName(Contracts.events.JOLT_FULLFILLED)]: processJoltFulfillmentEvent,

    // Community events
    [hash.getSelectorFromName(Contracts.events.COMMUNITY_CREATED)]: processCommunityCreatedEvent,
    [hash.getSelectorFromName(Contracts.events.JOINED_COMMUNITY)]: processCommunityMemberEvent,
    [hash.getSelectorFromName(Contracts.events.LEFT_COMMUNITY)]: processCommunityMemberEvent,
    [hash.getSelectorFromName(Contracts.events.COMMUNITY_MOD_ADDED)]: processCommunityModEvent,
    [hash.getSelectorFromName(Contracts.events.COMMUNITY_MOD_REMOVED)]: processCommunityModEvent,
    [hash.getSelectorFromName(Contracts.events.COMMUNITY_BAN_STATUS_UPDATED)]: processCommunityBanEvent,
    [hash.getSelectorFromName(Contracts.events.COMMUNITY_UPGRADED)]: processCommunityUpgradeEvent,
    [hash.getSelectorFromName(Contracts.events.COMMUNITY_GATE_KEEPED)]: processCommunityGateKeepEvent,
    [hash.getSelectorFromName(Contracts.events.DEPLOYED_COMMUNITY_NFT)]: processCommunityNftEvent,

    // Channel events
    [hash.getSelectorFromName(Contracts.events.CHANNEL_CREATED)]: processChannelCreatedEvent,
    [hash.getSelectorFromName(Contracts.events.JOINED_CHANNEL)]: processChannelMemberEvent,
    [hash.getSelectorFromName(Contracts.events.LEFT_CHANNEL)]: processChannelMemberEvent,
    [hash.getSelectorFromName(Contracts.events.CHANNEL_MOD_ADDED)]: processChannelModEvent,
    [hash.getSelectorFromName(Contracts.events.CHANNEL_MOD_REMOVED)]: processChannelModEvent,
    [hash.getSelectorFromName(Contracts.events.CHANNEL_BAN_STATUS_UPDATED)]: processChannelBanEvent,

    // User action events
    [hash.getSelectorFromName(Contracts.events.FOLLOWED)]: processFollowEvent,
    [hash.getSelectorFromName(Contracts.events.UNFOLLOWED)]: processUnfollowEvent,
    [hash.getSelectorFromName(Contracts.events.FOLLOWER_BLOCKED)]: processBlockEvent,
    [hash.getSelectorFromName(Contracts.events.FOLLOWER_UNBLOCKED)]: processUnblockEvent,

};

// Create handler map with proper typing
const EventHandlers: { [key: string]: (event: any, db: DataSource) => Promise<void> } = {
    // Handle events
    [hash.getSelectorFromName(Contracts.events.HANDLE_MINTED)]: handleMintedEvent,
    [hash.getSelectorFromName(Contracts.events.HANDLE_BURNT)]: handleBurnedEvent,
    [hash.getSelectorFromName(Contracts.events.HANDLE_LINKED)]: handleLinkedEvent,
    [hash.getSelectorFromName(Contracts.events.HANDLE_UNLINKED)]: handleUnlinkedEvent,

    // Profile events
    [hash.getSelectorFromName(Contracts.events.PROFILE_CREATED)]: handleCreateProfile,

    // Jolt events
    [hash.getSelectorFromName(Contracts.events.JOLTED)]: handleJoltEvent,
    [hash.getSelectorFromName(Contracts.events.JOLT_REQUESTED)]: handleJoltRequestEvent,
    [hash.getSelectorFromName(Contracts.events.JOLT_FULLFILLED)]: handleJoltFulfillmentEvent,

    // Community events
    [hash.getSelectorFromName(Contracts.events.COMMUNITY_CREATED)]: handleCommunityCreated,
    [hash.getSelectorFromName(Contracts.events.JOINED_COMMUNITY)]: handleCommunityMemberJoined,
    [hash.getSelectorFromName(Contracts.events.LEFT_COMMUNITY)]: handleCommunityMemberLeft,
    [hash.getSelectorFromName(Contracts.events.COMMUNITY_MOD_ADDED)]: handleCommunityModAdded,
    [hash.getSelectorFromName(Contracts.events.COMMUNITY_MOD_REMOVED)]: handleCommunityModRemoved,
    [hash.getSelectorFromName(Contracts.events.COMMUNITY_BAN_STATUS_UPDATED)]: handleCommunityBanStatusUpdated,
    [hash.getSelectorFromName(Contracts.events.COMMUNITY_UPGRADED)]: handleCommunityUpgraded,
    [hash.getSelectorFromName(Contracts.events.COMMUNITY_GATE_KEEPED)]: handleCommunityGateKeeped,
    [hash.getSelectorFromName(Contracts.events.DEPLOYED_COMMUNITY_NFT)]: handleCommunityNftDeployed,

    // Channel events
    [hash.getSelectorFromName(Contracts.events.CHANNEL_CREATED)]: handleChannelCreated,
    [hash.getSelectorFromName(Contracts.events.JOINED_CHANNEL)]: handleChannelMemberJoined,
    [hash.getSelectorFromName(Contracts.events.LEFT_CHANNEL)]: handleChannelMemberLeft,
    [hash.getSelectorFromName(Contracts.events.CHANNEL_MOD_ADDED)]: handleChannelModAdded,
    [hash.getSelectorFromName(Contracts.events.CHANNEL_MOD_REMOVED)]: handleChannelModRemoved,
    [hash.getSelectorFromName(Contracts.events.CHANNEL_BAN_STATUS_UPDATED)]: handleChannelBanStatusUpdated,

    // User action events
    [hash.getSelectorFromName(Contracts.events.FOLLOWED)]: handleFollowEvent,
    [hash.getSelectorFromName(Contracts.events.UNFOLLOWED)]: handleUnfollowEvent,
    [hash.getSelectorFromName(Contracts.events.FOLLOWER_BLOCKED)]: handleBlockEvent,
    [hash.getSelectorFromName(Contracts.events.FOLLOWER_UNBLOCKED)]: handleUnblockEvent,
};

// Build filter
const filter: any = {
    events: [],
    header: { weak: false }
};

// Add contracts to monitor
Object.keys(Contracts.contracts.sepolia).forEach((contractKey) => {
    const address = Contracts.contracts.sepolia[contractKey as keyof typeof Contracts.contracts.sepolia];
    const eventKeys = Object.values(Contracts.events).map(key => hash.getSelectorFromName(key));

    filter.events.push({
        fromAddress: address,
        keys: eventKeys,
        includeReceipt: false,
        includeReverted: false,
    });
});

export const config = {
    streamUrl: "https://mainnet.starknet.a5a.ch",
    startingBlock: Number(Deno.env.get("START_BLOCK")),
    network: "starknet",
    finality: "DATA_STATUS_ACCEPTED",
    filter: filter,
    sinkType: "postgres",
    sinkOptions: {
        noTls: true,
        tableName: "events",
    },
};

initializeDatabase();

// Main transformer function
export default async function transform({ header, events }: v1alpha2.Block) {
    if (!header || !events) return [];

    const { blockNumber, timestamp } = header;
    const results = [];

    for (const { event, transaction } of events) {
        if (!transaction?.meta || !event?.data || !event?.keys) continue;

        const eventKeys = event.keys.map((key) =>
            FieldElement.toHex(key),
        );

        const matchingProcessors = Object.keys(EventProcessors).filter(processorKey =>
            eventKeys.includes(processorKey)
        );

        const matchingHandlers = Object.keys(EventHandlers).filter(handlerKey =>
            eventKeys.includes(handlerKey)
        );

        if (matchingProcessors.length === 0 || matchingHandlers.length === 0) {
            console.error(`No matching processors/handlers found for event keys: ${eventKeys}`);
            continue;
        }

        try {
            // Process and handle each matching event
            for (const processorKey of matchingProcessors) {
                const processor = EventProcessors[processorKey];
                const handler = EventHandlers[processorKey];

                if (!processor || !handler) {
                    console.error(`Missing processor or handler for key: ${processorKey}`);
                    continue;
                }

                // Process the event
                const processedEvent = processor(event);

                // Handle the event
                await handler(processedEvent, AppDataSource);

                // Store the event metadata
                results.push({
                    block_number: toNumber(blockNumber),
                    tx_hash: FieldElement.toHex(transaction.meta.hash!),
                    tx_index: toNumber(transaction.meta.transactionIndex),
                    event_index: toNumber(event.index),
                    contract: FieldElement.toHex(event.fromAddress!),
                    event_key: processorKey,
                    timestamp: toNumber(timestamp?.seconds),
                    data: processedEvent,
                });
            }
        } catch (error) {
            console.error(`Error processing event: ${error}`);
            continue;
        }
    }

    return results;
}