export default {
  ADMIN: "0x02F659cf8CCE41168B8c0A8BedCE468E33BE1B7bd26E920266C025Dc0F8FBD1b",
  contracts: {
    sepolia: {
      coloniz_hub:
        "0x04bd89ef797c5a34a3c8bcc9dafca270959d9edcd568ea22a2364ffb3af959f0",
    },
    mainnet: {
      coloniz_hub:
        "0x04bd89ef797c5a34a3c8bcc9dafca270959d9edcd568ea22a2364ffb3af959f0",
    },
    classHashes: {
      COLONIZ_HANDLE:
        "0x01d7ecd040eef32b4b9195df23a68972b84f5b1a109074cc4b4b3400d9fb69f0",
      COLONIZ_REGISTRY:
        "0x04bb8954cf9f1a844a9708ff2504db9ff7665d5cd17bead70abd3e19bd591263",
      COLONIZ_NFT:
        "0x03ef4b9105de55f786d7b22852987402b56d398ebad23d4ace769fbd98c9dc3b",
      COLONIZ_COMMUNITY:
        "0x061e947cd6f7b4fba0dd65f101f782b56cab35da0e46de6889e07d0149384395",
      COLONIZ_CHANNEL:
        "0x01898f9b1277fbe1ba6185f5001b988aadba71440276e99bebce5648f3044947",
      COLONIZ_FOLLOW:
        "0x05dffad824556defac917572ffe4644a3b652662779bafd346888d09306dfe0d",
      COLONIZ_HUB:
        "0x02dc3f082f5a293ce000bb3449f26fd73c80fb1470584fbdf0c9a934c34ca14a",
      COLONIZ_PROFILE:
        "0x05e50417298ac6b249ab3266b85739359ba2e6e88b3580186cfc06fa0b037633",
      COLONIZ_JOLT:
        "0x03ebf20a60f5ed63ef17f5edfd5b996ba6bf34e53fa7bef95f8914dcf0df608f",
    },
  },
  events: {
    PROFILE_CREATED: "ProfileEvent",

    HANDLE_MINTED: "HandleMinted",
    HANDLE_BURNT: "HandleBurnt",
    HANDLE_LINKED: "Linked",
    HANDLE_UNLINKED: "HandleUnlinked",

    FOLLOWED: "Followed",
    UNFOLLOWED: "Unfollowed",
    FOLLOWER_BLOCKED: "FollowerBlocked",
    FOLLOWER_UNBLOCKED: "FollowerUnblocked",

    POST: "Post",
    COMMENT_CREATED: "CommentCreated",
    REPOST_CREATED: "RepostCreated",
    UPVOTED: "Upvoted",
    DOWNVOTED: "Downvoted",
    COLLECTED_NFT: "CollectedNFT",
    DEPLOYED_COLLECT_NFT: "DeployedCollectNFT",

    COMMUNITY_CREATED: "CommunityCreated",
    JOINED_COMMUNITY: "JoinedCommunity",
    LEFT_COMMUNITY: "LeftCommunity",
    COMMUNITY_MOD_ADDED: "CommunityModAdded",
    COMMUNITY_MOD_REMOVED: "CommunityModRemoved",
    COMMUNITY_BAN_STATUS_UPDATED: "CommunityBanStatusUpdated",
    COMMUNITY_UPGRADED: "CommunityUpgraded",
    COMMUNITY_GATE_KEEPED: "CommunityGatekeeped",
    DEPLOYED_COMMUNITY_NFT: "DeployedCommunityNft",

    CHANNEL_CREATED: "ChannelCreated",
    JOINED_CHANNEL: "JoinedChannel",
    LEFT_CHANNEL: "LeftChannel",
    CHANNEL_MOD_ADDED: "ChannelModAdded",
    CHANNEL_MOD_REMOVED: "ChannelModRemoved",
    CHANNEL_BAN_STATUS_UPDATED: "ChannelBanStatusUpdated",

    JOLTED: "Jolted",
    JOLT_REQUESTED: "JoltRequested",
    JOLT_FULLFILLED: "JoltFullfilled",
  },
};
