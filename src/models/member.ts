import { EntitySchema } from "../lib/typeorm.js";
import { type Profile } from "./profile.ts";
import { type Community } from "./community.ts";
import { type Channel } from "./channel.ts";

export interface Member {
  id: number;
  profile: Profile;
  tokenId: number | null;
  timestamp: number;
  executor: string;
}

export interface ChannelMember extends Member {
  channel: Channel;
}

export interface ChannelMod extends Member {
  channel: Channel;
}

export interface ChannelBannedMember extends Member {
  channel: Channel;
}

export interface CommunityMember extends Member {
  community: Community;
}

export interface CommunityMod extends Member {
  community: Community;
}

export interface CommunityBannedMember extends Member {
  community: Community;
}

export interface CommunityUpgraded extends Member {
  community: Community;
}

export interface CommunityGateKeeped extends Member {
  community: Community;
}

// @ts-ignore
export const MemberSchema = new EntitySchema<Member>({
  name: "Member",
  tableName: "members",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    tokenId: {
      type: "bigint",
      name: "token_id",
      nullable: true,
    },
    timestamp: {
      type: "bigint",
      name: "timestamp",
    },
    executor: {
      type: String,
      name: "executor",
    },
  },
  relations: {
    profile: {
      type: "many-to-one",
      target: "Profile",
      joinColumn: {
        name: "profile_address",
      },
    },
  },
});

// @ts-ignore
export const ChannelMemberSchema = new EntitySchema<ChannelMember>({
  name: "ChannelMember",
  tableName: "channel_members",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    tokenId: {
      type: "bigint",
      name: "token_id",
      nullable: true,
    },
    timestamp: {
      type: "bigint",
      name: "timestamp",
    },
    executor: {
      type: String,
      name: "executor",
    },
  },
  relations: {
    profile: {
      type: "many-to-one",
      target: "Profile",
      joinColumn: {
        name: "profile_address",
      },
    },
    channel: {
      type: "many-to-one",
      target: "Channel",
      joinColumn: {
        name: "channel_id",
      },
    },
  },
});

// @ts-ignore
export const ChannelModSchema = new EntitySchema<ChannelMod>({
  name: "ChannelMod",
  tableName: "channel_mods",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    tokenId: {
      type: "bigint",
      name: "token_id",
      nullable: true,
    },
    timestamp: {
      type: "bigint",
      name: "timestamp",
    },
    executor: {
      type: String,
      name: "executor",
    },
  },
  relations: {
    profile: {
      type: "many-to-one",
      target: "Profile",
      joinColumn: {
        name: "profile_address",
      },
    },
    channel: {
      type: "many-to-one",
      target: "Channel",
      joinColumn: {
        name: "channel_id",
      },
    },
  },
});

// @ts-ignore
export const ChannelBannedMemberSchema = new EntitySchema<ChannelBannedMember>({
  name: "ChannelBannedMember",
  tableName: "channel_banned_members",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    tokenId: {
      type: "bigint",
      name: "token_id",
      nullable: true,
    },
    timestamp: {
      type: "bigint",
      name: "timestamp",
    },
    executor: {
      type: String,
      name: "executor",
    },
  },
  relations: {
    profile: {
      type: "many-to-one",
      target: "Profile",
      joinColumn: {
        name: "profile_address",
      },
    },
    channel: {
      type: "many-to-one",
      target: "Channel",
      joinColumn: {
        name: "channel_id",
      },
    },
  },
});

// @ts-ignore
export const CommunityMemberSchema = new EntitySchema<CommunityMember>({
  name: "CommunityMember",
  tableName: "community_members",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    tokenId: {
      type: "bigint",
      name: "token_id",
      nullable: true,
    },
    timestamp: {
      type: "bigint",
      name: "timestamp",
    },
    executor: {
      type: String,
      name: "executor",
    },
  },
  relations: {
    profile: {
      type: "many-to-one",
      target: "Profile",
      joinColumn: {
        name: "profile_address",
      },
    },
    community: {
      type: "many-to-one",
      target: "Community",
      joinColumn: {
        name: "community_id",
      },
    },
  },
});

// @ts-ignore
export const CommunityModSchema = new EntitySchema<CommunityMod>({
  name: "CommunityMod",
  tableName: "community_mods",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    tokenId: {
      type: "bigint",
      name: "token_id",
      nullable: true,
    },
    timestamp: {
      type: "bigint",
      name: "timestamp",
    },
    executor: {
      type: String,
      name: "executor",
    },
  },
  relations: {
    profile: {
      type: "many-to-one",
      target: "Profile",
      joinColumn: {
        name: "profile_address",
      },
    },
    community: {
      type: "many-to-one",
      target: "Community",
      joinColumn: {
        name: "community_id",
      },
    },
  },
});

export const CommunityBannedMemberSchema = new EntitySchema<
  // @ts-ignore
  CommunityBannedMember
>({
  name: "CommunityBannedMember",
  tableName: "community_banned_memebers",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    tokenId: {
      type: "bigint",
      name: "token_id",
      nullable: true,
    },
    timestamp: {
      type: "bigint",
      name: "timestamp",
    },
    executor: {
      type: String,
      name: "executor",
    },
  },
  relations: {
    profile: {
      type: "many-to-one",
      target: "Profile",
      joinColumn: {
        name: "profile_address",
      },
    },
    community: {
      type: "many-to-one",
      target: "Community",
      joinColumn: {
        name: "community_id",
      },
    },
  },
});

// @ts-ignore
export const CommunityUpgradedSchema = new EntitySchema<CommunityUpgraded>({
  name: "CommunityUpgraded",
  tableName: "community_upgrades",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    tokenId: {
      type: "bigint",
      name: "token_id",
      nullable: true,
    },
    timestamp: {
      type: "bigint",
      name: "timestamp",
    },
    executor: {
      type: String,
      name: "executor",
    },
  },
  relations: {
    profile: {
      type: "many-to-one",
      target: "Profile",
      joinColumn: {
        name: "profile_address",
      },
    },
    community: {
      type: "many-to-one",
      target: "Community",
      joinColumn: {
        name: "community_id",
      },
    },
  },
});

// @ts-ignore
export const CommunityGateKeepedSchema = new EntitySchema<CommunityGateKeeped>({
  name: "CommunityGateKeeped",
  tableName: "community_gate_keeps",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    tokenId: {
      type: "bigint",
      name: "token_id",
      nullable: true,
    },
    timestamp: {
      type: "bigint",
      name: "timestamp",
    },
    executor: {
      type: String,
      name: "executor",
    },
  },
  relations: {
    profile: {
      type: "many-to-one",
      target: "Profile",
      joinColumn: {
        name: "profile_address",
      },
    },
    community: {
      type: "many-to-one",
      target: "Community",
      joinColumn: {
        name: "community_id",
      },
    },
  },
});
