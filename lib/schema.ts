import { relations } from "drizzle-orm";
import {
    bigint,
    boolean,
    json,
    pgEnum,
    pgTable,
    text,
    timestamp,
    varchar,
    serial,
    integer,
} from "drizzle-orm/pg-core";

// Enums
export const PremiumType = pgEnum("premium_type", ["Free", "Premium", "Business"]);
export const GateKeepType = pgEnum("gate_keep_type", ["None", "Token", "NFT"]);
export const HandleStatus = pgEnum("handle_status", [
    "minted",
    "linked",
    "unlinked",
    "burned",
]);
export const FollowStatus = pgEnum("follow_status", ["followed", "unfollowed"]);
export const PublicationType = pgEnum("publication_type", [
    "Comment",
    "Repost",
    "Post",
]);
export const VoteType = pgEnum("vote_type", ["Upvote", "Downvote"]);
export const DocumentStatus = pgEnum("document_status", [
    "PROCESSING",
    "COMPLETED",
    "FAILED",
]);
export const DocumentType = pgEnum("document_type", [
    "FILE",
    "FAQ",
    "CRAWL",
]);

// Tables
export const profiles = pgTable("profiles", {
    id: serial("id").primaryKey().notNull(),
    profileAddress: varchar("profile_address", { length: 255 }).unique()
        .notNull(),
    profileOwner: varchar("profile_owner", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).unique(),
    bio: text("bio"),
    pubCount: bigint("pub_count", { mode: "number" }).notNull(),
    metadataURI: varchar("metadata_URI", { length: 255 }),
    followNft: varchar("follow_nft", { length: 255 }).unique(),
    createdAt: bigint("created_at", { mode: "number" }).notNull(),
    tokenId: bigint("token_id", { mode: "number" }).unique(),
    displayName: varchar("display_name", { length: 255 }),
    coverPhoto: varchar("cover_photo", { length: 255 }),
    displayPhoto: varchar("display_photo", { length: 255 }),
});

export const handles = pgTable("handles", {
    id: serial("id").primaryKey().notNull(),
    handle: varchar("handle", { length: 255 }).unique().notNull(),
    handleId: varchar("handle_id", { length: 255 }).unique().notNull(),
    owner: varchar("owner", { length: 255 }).notNull(),
    status: HandleStatus("status").notNull().default("minted"),
    createdAt: bigint("created_at", { mode: "number" }).notNull(),
    profileAddress: varchar("profile_address", { length: 255 }).references(() =>
        profiles.profileAddress
    ),
});

export const communities = pgTable("community", {
    id: serial("id").primaryKey().notNull(),
    communityId: bigint("community_id", { mode: "number" }).unique().notNull(),
    communityName: varchar("community_name", { length: 255 }),
    communityDescription: text("community_description"),
    logo: varchar("logo", { length: 255 }),
    communityNftAddress: varchar("community_nft_address", { length: 255 }),
    totalNumberOfPosts: bigint("total_number_of_posts", { mode: "number" })
        .default(0),
    totalNumberOfUpvotes: bigint("total_number_of_upvotes", { mode: "number" })
        .default(0),
    totalAmountSentInJolts: bigint("total_amount_sent_in_jolts", {
        mode: "number",
    }).default(0),
    premiumType: PremiumType("premium_type").notNull().default("Free"),
    gateKeepType: GateKeepType("gate_keep_type").notNull().default("None"),
    createdTimestamp: bigint("created_timestamp", { mode: "number" }),
    coverPhoto: varchar("cover_photo", { length: 255 }),
    displayPhoto: varchar("display_photo", { length: 255 }),
    accentColor: varchar("accent_color", { length: 255 }),
    subDomain: varchar("sub_domain", { length: 255 }).unique(),
    domain: varchar("domain", { length: 255 }).unique(),
    communityOwner: varchar("community_owner", { length: 255 }).references(() =>
        profiles.profileAddress
    ),
});

export const channels = pgTable("channels", {
    id: serial("id").primaryKey().notNull(),
    channelId: bigint("channel_id", { mode: "number" }).unique().notNull(),
    channelName: varchar("channel_name", { length: 255 }),
    channelDescription: text("channel_description"),
    createdTimestamp: bigint("created_timestamp", { mode: "number" }).notNull(),
    totalNumberOfPosts: bigint("total_number_of_posts", { mode: "number" })
        .default(0),
    totalNumberOfUpvotes: bigint("total_number_of_upvotes", { mode: "number" })
        .default(0),
    totalAmountSentInJolts: bigint("total_amount_sent_in_jolts", {
        mode: "number",
    }).default(0),
    communityId: bigint("community_id", { mode: "number" }).references(() =>
        communities.id
    ),
    channelOwner: varchar("channel_owner", { length: 255 }).references(() =>
        profiles.profileAddress
    ),
});

export const publications = pgTable("publications", {
    id: serial("id").primaryKey().notNull(),
    pubId: bigint("pub_id", { mode: "number" }).unique().notNull(),
    content: text("content").notNull(),
    images: json("images").$type<string[]>(),
    pubType: PublicationType("publication_type").notNull().default("Post"),
    pointedProfileAddress: varchar("pointed_profile_address", { length: 255 }),
    pointedPubId: bigint("pointed_pub_id", { mode: "number" }),
    rootProfileAddress: varchar("root_profile_address", { length: 255 }),
    rootPubId: bigint("root_pub_id", { mode: "number" }),
    upvote: bigint("upvote", { mode: "number" }).default(0),
    downvote: bigint("downvote", { mode: "number" }).default(0),
    totalComments: bigint("total_comments", { mode: "number" }).default(0),
    totalReposts: bigint("total_reposts", { mode: "number" }).default(0),
    approved: boolean("approved").default(false),
    tippedAmount: bigint("tipped_amount", { mode: "number" }).default(0),
    createdAt: timestamp("created_at").notNull(),
    creator: varchar("creator", { length: 255 }).references(() =>
        profiles.profileAddress
    ),
    channelId: bigint("channel_id", { mode: "number" }).references(() =>
        channels.id
    ),
    communityId: bigint("community_id", { mode: "number" }).references(() =>
        communities.id
    ),
});

export const votes = pgTable("votes", {
    id: serial("id").primaryKey().notNull(),
    voteType: VoteType("vote_type").notNull().default("Upvote"),
    createdAt: timestamp("created_at").notNull(),
    publicationId: bigint("publication_id", { mode: "number" }).references(() =>
        publications.id
    ),
    creator: varchar("creator", { length: 255 }).references(() =>
        profiles.profileAddress
    ),
});

export const follows = pgTable("follows", {
    id: serial("id").primaryKey().notNull(),
    followId: bigint("follow_id", { mode: "number" }).notNull(),
    followTimestamp: bigint("follow_timestamp", { mode: "number" }).notNull(),
    unfollowTimestamp: bigint("unfollow_timestamp", { mode: "number" }),
    status: FollowStatus("follow_status").notNull().default("unfollowed"),
    followerProfileAddress: varchar("follower_profile_address", { length: 255 })
        .references(() => profiles.profileAddress),
    followedProfileAddress: varchar("followed_profile_address", { length: 255 })
        .references(() => profiles.profileAddress),
});

export const blocks = pgTable("blocks", {
    id: serial("id").primaryKey().notNull(),
    blockTimestamp: bigint("block_timestamp", { mode: "number" }).notNull(),
    unblockTimestamp: bigint("unblock_timestamp", { mode: "number" }),
    isBlocked: boolean("is_blocked").default(true),
    blockerProfileAddress: varchar("blocker_profile_address", { length: 255 })
        .references(() => profiles.profileAddress),
    blockedProfileAddress: varchar("blocked_profile_address", { length: 255 })
        .references(() => profiles.profileAddress),
});

export const jolts = pgTable("jolts", {
    id: serial("id").primaryKey().notNull(),
    joltId: bigint("jolt_id", { mode: "number" }).unique().notNull(),
    joltType: varchar("jolt_type", { length: 255 }).notNull(),
    amount: bigint("amount", { mode: "number" }).default(0),
    createdTimestamp: bigint("created_timestamp", { mode: "number" }).notNull(),
    sender: varchar("sender", { length: 255 }).references(() =>
        profiles.profileAddress
    ),
    recipient: varchar("recipient", { length: 255 }).references(() =>
        profiles.profileAddress
    ),
});

// Member tables
const memberColumns = {
    id: serial("id").primaryKey().notNull(),
    tokenId: bigint("token_id", { mode: "number" }),
    timestamp: bigint("timestamp", { mode: "number" }).notNull(),
    executor: varchar("executor", { length: 255 }).notNull(),
    profileAddress: varchar("profile_address", { length: 255 }).references(() =>
        profiles.profileAddress
    ),
};

export const channelMembers = pgTable("channel_members", {
    ...memberColumns,
    channelId: bigint("channel_id", { mode: "number" }).references(() =>
        channels.id
    ),
});

export const channelMods = pgTable("channel_mods", {
    ...memberColumns,
    channelId: bigint("channel_id", { mode: "number" }).references(() =>
        channels.id
    ),
});

export const channelBannedMembers = pgTable("channel_banned_members", {
    ...memberColumns,
    channelId: bigint("channel_id", { mode: "number" }).references(() =>
        channels.id
    ),
});

export const communityMembers = pgTable("community_members", {
    ...memberColumns,
    communityId: bigint("community_id", { mode: "number" }).references(() =>
        communities.id
    ),
});

export const communityMods = pgTable("community_mods", {
    ...memberColumns,
    communityId: bigint("community_id", { mode: "number" }).references(() =>
        communities.id
    ),
});

export const communityBannedMembers = pgTable("community_banned_members", {
    ...memberColumns,
    communityId: bigint("community_id", { mode: "number" }).references(() =>
        communities.id
    ),
});

export const communityUpgrades = pgTable("community_upgrades", {
    ...memberColumns,
    communityId: bigint("community_id", { mode: "number" }).references(() =>
        communities.id
    ),
});

export const communityGateKeeps = pgTable("community_gate_keeps", {
    ...memberColumns,
    communityId: bigint("community_id", { mode: "number" }).references(() =>
        communities.id
    ),
});

// Additional tables from entity files
export const agentDocuments = pgTable("agent_documents", {
    id: serial("id").primaryKey().notNull(),
    documentId: varchar("document_id", { length: 255 }),
    s3Key: varchar("s3_key", { length: 255 }),
    originalName: varchar("original_name", { length: 255 }),
    status: DocumentStatus("status").default("PROCESSING").notNull(),
    chunksProcessed: integer("chunks_processed").default(0).notNull(),
    timestamp: bigint("timestamp", { mode: "number" }).notNull(),
    message: varchar("message", { length: 255 }),
    type: DocumentType("document_type").default("FILE").notNull(),
    content: text("content"),
    url: varchar("url", { length: 255 }),
    jobId: varchar("job_id", { length: 255 }),
    communityId: bigint("community_id", { mode: "number" }).references(() => communities.id),
});

export const notifications = pgTable("notifications", {
    id: serial("id").primaryKey().notNull(),
    type: varchar("type", { length: 255 }).notNull(),
    read: boolean("read").default(false),
    timestamp: bigint("timestamp", { mode: "number" }).notNull(),
    metadata: json("metadata"),
    recipientId: varchar("recipient_id", { length: 255 }).references(() => profiles.profileAddress),
});

export const referrals = pgTable("referrals", {
    id: serial("id").primaryKey().notNull(),
    referralCode: varchar("referral_code", { length: 255 }).unique().notNull(),
    status: varchar("status", { length: 255 }).default("PENDING"),
    timestamp: bigint("timestamp", { mode: "number" }).notNull(),
    referrerId: varchar("referrer_id", { length: 255 }).references(() => profiles.profileAddress),
    refereeId: varchar("referee_id", { length: 255 }).references(() => profiles.profileAddress),
});

export const subColonies = pgTable("sub_colonies", {
    id: serial("id").primaryKey().notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    timestamp: bigint("timestamp", { mode: "number" }).notNull(),
    communityId: bigint("community_id", { mode: "number" }).references(() => communities.id),
});

export const channelMessages = pgTable("channel_messages", {
    id: serial("id").primaryKey().notNull(),
    messageId: varchar("message_id", { length: 255 }).unique().notNull(),
    content: text("content").notNull(),
    timestamp: bigint("timestamp", { mode: "number" }).notNull(),
    edited: boolean("edited").default(false),
    editedTimestamp: bigint("edited_timestamp", { mode: "number" }),
    replyToId: varchar("reply_to_id", { length: 255 }),
    images: json("images").$type<string[]>(),
    senderId: varchar("sender_id", { length: 255 }).references(() => profiles.profileAddress),
    channelId: bigint("channel_id", { mode: "number" }).references(() => channels.id),
});

export const channelMessageReads = pgTable("channel_message_reads", {
    id: serial("id").primaryKey().notNull(),
    lastReadTimestamp: bigint("last_read_timestamp", { mode: "number" }).notNull(),
    profileId: varchar("profile_id", { length: 255 }).references(() => profiles.profileAddress),
    channelId: bigint("channel_id", { mode: "number" }).references(() => channels.id),
});

export const channelMessageReactions = pgTable("channel_message_reactions", {
    id: serial("id").primaryKey().notNull(),
    emoji: varchar("emoji", { length: 50 }).notNull(),
    timestamp: bigint("timestamp", { mode: "number" }).notNull(),
    messageId: varchar("message_id", { length: 255 }).references(() => channelMessages.messageId),
    profileId: varchar("profile_id", { length: 255 }).references(() => profiles.profileAddress),
});

export const publicationNfts = pgTable("publication_nfts", {
    id: serial("id").primaryKey().notNull(),
    nftAddress: varchar("nft_address", { length: 255 }).unique().notNull(),
    timestamp: bigint("timestamp", { mode: "number" }).notNull(),
    publicationId: bigint("publication_id", { mode: "number" }).references(() => publications.id),
});

export const collectNfts = pgTable("collectNfts", {
    id: serial("id").primaryKey().notNull(),
    nftAddress: varchar("nft_address", { length: 255 }).unique().notNull(),
    timestamp: bigint("timestamp", { mode: "number" }).notNull(),
    tokenId: bigint("token_id", { mode: "number" }).notNull(),
    publicationId: bigint("publication_id", { mode: "number" }).references(() => publications.id),
    ownerId: varchar("owner_id", { length: 255 }).references(() => profiles.profileAddress),
});

export const communityNfts = pgTable("community_nfts", {
    id: serial("id").primaryKey().notNull(),
    nftAddress: varchar("nft_address", { length: 255 }).unique().notNull(),
    timestamp: bigint("timestamp", { mode: "number" }).notNull(),
    tokenId: bigint("token_id", { mode: "number" }).notNull(),
    communityId: bigint("community_id", { mode: "number" }).references(() => communities.id),
    ownerId: varchar("owner_id", { length: 255 }).references(() => profiles.profileAddress),
});

export const images = pgTable("images", {
    id: serial("id").primaryKey().notNull(),
    url: varchar("url", { length: 255 }).notNull(),
});

export const nonces = pgTable("nonces", {
    id: serial("id").primaryKey().notNull(),
    nonce: varchar("nonce", { length: 255 }).unique().notNull(),
    timestamp: bigint("timestamp", { mode: "number" }).notNull(),
    profileId: varchar("profile_id", { length: 255 }).references(() => profiles.profileAddress),
});

export const categories = pgTable("categories", {
    id: serial("id").primaryKey().notNull(),
    name: varchar("name", { length: 255 }).unique().notNull(),
    order: integer("order").default(0),
});

// Relations
export const profilesRelations = relations(profiles, ({ many, one }) => ({
    handle: one(handles, {
        fields: [profiles.profileAddress],
        references: [handles.profileAddress],
    }),
    communityMemberships: many(communityMembers),
    communityModerations: many(communityMods),
    publications: many(publications),
    sentJolts: many(jolts, { relationName: "sender" }),
    receivedJolts: many(jolts, { relationName: "recipient" }),
    ownedCommunities: many(communities),
    ownedChannels: many(channels),
    votes: many(votes),
    followedBy: many(follows, { relationName: "followed" }),
    following: many(follows, { relationName: "follower" }),
    blockedBy: many(blocks, { relationName: "blocked" }),
    blocking: many(blocks, { relationName: "blocker" }),
}));

export const handlesRelations = relations(handles, ({ one }) => ({
    profile: one(profiles, {
        fields: [handles.profileAddress],
        references: [profiles.profileAddress],
    }),
}));

export const communitiesRelations = relations(communities, ({ one, many }) => ({
    owner: one(profiles, {
        fields: [communities.communityOwner],
        references: [profiles.profileAddress],
    }),
    channels: many(channels),
    publications: many(publications),
    members: many(communityMembers),
    moderators: many(communityMods),
    bannedMembers: many(communityBannedMembers),
    upgrades: many(communityUpgrades),
    gateKeeps: many(communityGateKeeps),
}));

export const channelsRelations = relations(channels, ({ one, many }) => ({
    community: one(communities, {
        fields: [channels.communityId],
        references: [communities.id],
    }),
    owner: one(profiles, {
        fields: [channels.channelOwner],
        references: [profiles.profileAddress],
    }),
    publications: many(publications),
    members: many(channelMembers),
    moderators: many(channelMods),
    bannedMembers: many(channelBannedMembers),
}));

export const publicationsRelations = relations(
    publications,
    ({ one, many }) => ({
        creator: one(profiles, {
            fields: [publications.creator],
            references: [profiles.profileAddress],
        }),
        channel: one(channels, {
            fields: [publications.channelId],
            references: [channels.id],
        }),
        community: one(communities, {
            fields: [publications.communityId],
            references: [communities.id],
        }),
        votes: many(votes),
    }),
);

export const votesRelations = relations(votes, ({ one }) => ({
    publication: one(publications, {
        fields: [votes.publicationId],
        references: [publications.id],
    }),
    creator: one(profiles, {
        fields: [votes.creator],
        references: [profiles.profileAddress],
    }),
}));

export const followsRelations = relations(follows, ({ one }) => ({
    follower: one(profiles, {
        fields: [follows.followerProfileAddress],
        references: [profiles.profileAddress],
    }),
    followed: one(profiles, {
        fields: [follows.followedProfileAddress],
        references: [profiles.profileAddress],
    }),
}));

export const blocksRelations = relations(blocks, ({ one }) => ({
    blocker: one(profiles, {
        fields: [blocks.blockerProfileAddress],
        references: [profiles.profileAddress],
    }),
    blocked: one(profiles, {
        fields: [blocks.blockedProfileAddress],
        references: [profiles.profileAddress],
    }),
}));

export const joltsRelations = relations(jolts, ({ one }) => ({
    senderProfile: one(profiles, {
        fields: [jolts.sender],
        references: [profiles.profileAddress],
    }),
    recipientProfile: one(profiles, {
        fields: [jolts.recipient],
        references: [profiles.profileAddress],
    }),
}));

export const channelMembersRelations = relations(channelMembers, ({ one }) => ({
    channel: one(channels, {
        fields: [channelMembers.channelId],
        references: [channels.id],
    }),
    profile: one(profiles, {
        fields: [channelMembers.profileAddress],
        references: [profiles.profileAddress],
    }),
}));

export const channelModsRelations = relations(channelMods, ({ one }) => ({
    channel: one(channels, {
        fields: [channelMods.channelId],
        references: [channels.id],
    }),
    profile: one(profiles, {
        fields: [channelMods.profileAddress],
        references: [profiles.profileAddress],
    }),
}));

export const channelBannedMembersRelations = relations(
    channelBannedMembers,
    ({ one }) => ({
        channel: one(channels, {
            fields: [channelBannedMembers.channelId],
            references: [channels.id],
        }),
        profile: one(profiles, {
            fields: [channelBannedMembers.profileAddress],
            references: [profiles.profileAddress],
        }),
    }),
);

export const communityMembersRelations = relations(
    communityMembers,
    ({ one }) => ({
        community: one(communities, {
            fields: [communityMembers.communityId],
            references: [communities.id],
        }),
        profile: one(profiles, {
            fields: [communityMembers.profileAddress],
            references: [profiles.profileAddress],
        }),
    }),
);

export const communityModsRelations = relations(communityMods, ({ one }) => ({
    community: one(communities, {
        fields: [communityMods.communityId],
        references: [communities.id],
    }),
    profile: one(profiles, {
        fields: [communityMods.profileAddress],
        references: [profiles.profileAddress],
    }),
}));

export const communityBannedMembersRelations = relations(
    communityBannedMembers,
    ({ one }) => ({
        community: one(communities, {
            fields: [communityBannedMembers.communityId],
            references: [communities.id],
        }),
        profile: one(profiles, {
            fields: [communityBannedMembers.profileAddress],
            references: [profiles.profileAddress],
        }),
    }),
);

export const communityUpgradesRelations = relations(
    communityUpgrades,
    ({ one }) => ({
        community: one(communities, {
            fields: [communityUpgrades.communityId],
            references: [communities.id],
        }),
        profile: one(profiles, {
            fields: [communityUpgrades.profileAddress],
            references: [profiles.profileAddress],
        }),
    }),
);

export const communityGateKeepsRelations = relations(
    communityGateKeeps,
    ({ one }) => ({
        community: one(communities, {
            fields: [communityGateKeeps.communityId],
            references: [communities.id],
        }),
        profile: one(profiles, {
            fields: [communityGateKeeps.profileAddress],
            references: [profiles.profileAddress],
        }),
    }),
);

export const agentDocumentsRelations = relations(agentDocuments, ({ one }) => ({
    community: one(communities, {
        fields: [agentDocuments.communityId],
        references: [communities.id],
    }),
}));

export const channelMessagesRelations = relations(channelMessages, ({ one, many }) => ({
    sender: one(profiles, {
        fields: [channelMessages.senderId],
        references: [profiles.profileAddress],
    }),
    channel: one(channels, {
        fields: [channelMessages.channelId],
        references: [channels.id],
    }),
    reactions: many(channelMessageReactions),
    replyTo: one(channelMessages, {
        fields: [channelMessages.replyToId],
        references: [channelMessages.messageId],
    }),
}));

export const channelMessageReactionsRelations = relations(channelMessageReactions, ({ one }) => ({
    message: one(channelMessages, {
        fields: [channelMessageReactions.messageId],
        references: [channelMessages.messageId],
    }),
    profile: one(profiles, {
        fields: [channelMessageReactions.profileId],
        references: [profiles.profileAddress],
    }),
}));

export const channelMessageReadsRelations = relations(channelMessageReads, ({ one }) => ({
    profile: one(profiles, {
        fields: [channelMessageReads.profileId],
        references: [profiles.profileAddress],
    }),
    channel: one(channels, {
        fields: [channelMessageReads.channelId],
        references: [channels.id],
    }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
    recipient: one(profiles, {
        fields: [notifications.recipientId],
        references: [profiles.profileAddress],
    }),
}));

export const referralsRelations = relations(referrals, ({ one }) => ({
    referrer: one(profiles, {
        fields: [referrals.referrerId],
        references: [profiles.profileAddress],
    }),
    referee: one(profiles, {
        fields: [referrals.refereeId],
        references: [profiles.profileAddress],
    }),
}));

export const subColoniesRelations = relations(subColonies, ({ one }) => ({
    community: one(communities, {
        fields: [subColonies.communityId],
        references: [communities.id],
    }),
}));

export const publicationNftsRelations = relations(publicationNfts, ({ one }) => ({
    publication: one(publications, {
        fields: [publicationNfts.publicationId],
        references: [publications.id],
    }),
}));

export const collectNftsRelations = relations(collectNfts, ({ one }) => ({
    publication: one(publications, {
        fields: [collectNfts.publicationId],
        references: [publications.id],
    }),
    owner: one(profiles, {
        fields: [collectNfts.ownerId],
        references: [profiles.profileAddress],
    }),
}));

export const communityNftsRelations = relations(communityNfts, ({ one }) => ({
    community: one(communities, {
        fields: [communityNfts.communityId],
        references: [communities.id],
    }),
    owner: one(profiles, {
        fields: [communityNfts.ownerId],
        references: [profiles.profileAddress],
    }),
}));

export const noncesRelations = relations(nonces, ({ one }) => ({
    profile: one(profiles, {
        fields: [nonces.profileId],
        references: [profiles.profileAddress],
    }),
}));

// Categories table has no direct relations in this schema

