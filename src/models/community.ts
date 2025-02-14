import { EntitySchema } from "typeorm";
import { type Profile } from "./profile.ts";
import { type Channel } from "./channel.ts";
import {
  type CommunityBannedMember,
  type CommunityGateKeeped,
  type CommunityMember,
  type CommunityMod,
  type CommunityUpgraded,
} from "./member.ts";
import { type Publication } from "./publication.ts";

export enum PremiumType {
  Free = "Free",
  Premium = "Premium",
}

export enum GateKeepType {
  None = "None",
  Token = "Token",
  NFT = "NFT",
}

export interface Community {
  id: number;
  communityId: number;
  channels: Channel[];
  communityName: string | null;
  communityDescription: string | null;
  logo: string | null;
  communityOwner: Profile | null;
  communityNftAddress: string | null;
  members: CommunityMember[];
  mods: CommunityMod[];
  totalNumberOfPosts: number;
  totalNumberOfUpvotes: number;
  totalAmountSentInJolts: number;
  bannedMembers: CommunityBannedMember[];
  premiumType: PremiumType;
  upgrades: CommunityUpgraded[];
  gateKeepType: GateKeepType;
  gateKeeps: CommunityGateKeeped[];
  communityNft: any | null;
  publications: Publication[];
  categories: any[];
  createdTimestamp: number | null;
  coverPhoto: string | null;
  displayPhoto: string | null;
  accentColor: string | null;
  subDomain: string | null;
  domain: string | null;
}

export const CommunitySchema = new EntitySchema<Community>({
  name: "Community",
  tableName: "community",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    communityId: {
      type: "bigint",
      name: "community_id",
      unique: true,
    },
    communityName: {
      type: String,
      name: "community_name",
      nullable: true,
    },
    communityDescription: {
      type: String,
      name: "community_description",
      nullable: true,
    },
    logo: {
      type: String,
      nullable: true,
    },
    communityNftAddress: {
      type: String,
      name: "community_nft_address",
      nullable: true,
    },
    totalNumberOfPosts: {
      type: "bigint",
      name: "total_number_of_posts",
      default: 0,
    },
    totalNumberOfUpvotes: {
      type: "bigint",
      name: "total_number_of_upvotes",
      default: 0,
    },
    totalAmountSentInJolts: {
      type: "bigint",
      name: "total_amount_sent_in_jolts",
      default: 0,
    },
    premiumType: {
      type: "enum",
      enum: PremiumType,
      name: "premium_type",
      default: PremiumType.Free,
    },
    gateKeepType: {
      type: "enum",
      enum: GateKeepType,
      name: "gate_keep_type",
      default: GateKeepType.None,
    },
    createdTimestamp: {
      type: "bigint",
      name: "created_timestamp",
      nullable: true,
    },
    coverPhoto: {
      type: String,
      name: "cover_photo",
      nullable: true,
    },
    displayPhoto: {
      type: String,
      name: "display_photo",
      nullable: true,
    },
    accentColor: {
      type: String,
      name: "accent_color",
      nullable: true,
    },
    subDomain: {
      type: String,
      name: "sub_domain",
      nullable: true,
      unique: true,
      transformer: {
        to: (value: string | null) => value?.toLowerCase() ?? null,
        from: (value: string | null) => value,
      },
    },
    domain: {
      type: String,
      nullable: true,
      unique: true,
      transformer: {
        to: (value: string | null) => {
          if (!value) return null;
          return value.replace(/^(https?:\/\/)?(www\.)?/i, "").toLowerCase();
        },
        from: (value: string | null) => value,
      },
    },
  },
  relations: {
    channels: {
      type: "one-to-many",
      target: "Channel",
      inverseSide: "community",
    },
    communityOwner: {
      type: "many-to-one",
      target: "Profile",
      joinColumn: {
        name: "community_owner",
      },
      nullable: true,
    },
    members: {
      type: "one-to-many",
      target: "CommunityMember",
      inverseSide: "community",
    },
    mods: {
      type: "one-to-many",
      target: "CommunityMod",
      inverseSide: "community",
    },
    bannedMembers: {
      type: "one-to-many",
      target: "CommunityBannedMember",
      inverseSide: "community",
    },
    upgrades: {
      type: "one-to-many",
      target: "CommunityUpgraded",
      inverseSide: "community",
    },
    gateKeeps: {
      type: "one-to-many",
      target: "CommunityGateKeeped",
      inverseSide: "community",
    },
    communityNft: {
      type: "one-to-one",
      target: "CommunityNft",
      joinColumn: true,
    },
    publications: {
      type: "one-to-many",
      target: "Publication",
      inverseSide: "community",
    },
    categories: {
      type: "many-to-many",
      target: "Category",
      joinTable: {
        name: "community_categories",
        joinColumn: {
          name: "community_id",
          referencedColumnName: "id",
        },
        inverseJoinColumn: {
          name: "category_id",
          referencedColumnName: "id",
        },
      },
    },
  },
});
