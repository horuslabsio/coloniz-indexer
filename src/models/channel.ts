import { EntitySchema } from "typeorm";
import { type Community } from "./community.ts";
import { type Profile } from "./profile.ts";
import {
  type ChannelBannedMember,
  type ChannelMember,
  type ChannelMod,
} from "./member.ts";
import { type Publication } from "./publication.ts";

export interface Channel {
  id: number;
  channelId: number;
  channelName: string | null;
  channelDescription: string | null;
  community: Community | null;
  channelOwner: Profile | null;
  createdTimestamp: number;
  members: ChannelMember[];
  mods: ChannelMod[];
  bannedMembers: ChannelBannedMember[];
  publications: Publication[];
  messages: any[];
  totalNumberOfPosts: number;
  totalNumberOfUpvotes: number;
  totalAmountSentInJolts: number;
}

export const ChannelSchema = new EntitySchema<Channel>({
  name: "Channel",
  tableName: "channels",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    channelId: {
      type: "bigint",
      name: "channel_id",
      unique: true,
    },
    channelName: {
      type: String,
      name: "channel_name",
      nullable: true,
    },
    channelDescription: {
      type: String,
      name: "channel_description",
      nullable: true,
    },
    createdTimestamp: {
      type: "bigint",
      name: "created_timestamp",
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
  },
  relations: {
    community: {
      type: "many-to-one",
      target: "Community",
      joinColumn: {
        name: "community_id",
      },
      nullable: true,
    },
    channelOwner: {
      type: "many-to-one",
      target: "Profile",
      joinColumn: {
        name: "channel_owner",
      },
      nullable: true,
    },
    members: {
      type: "one-to-many",
      target: "ChannelMember",
      inverseSide: "channel",
    },
    mods: {
      type: "one-to-many",
      target: "ChannelMod",
      inverseSide: "channel",
    },
    bannedMembers: {
      type: "one-to-many",
      target: "ChannelBannedMember",
      inverseSide: "channel",
    },
    publications: {
      type: "one-to-many",
      target: "Publication",
      inverseSide: "channel",
    },
    messages: {
      type: "one-to-many",
      target: "ChannelMessage",
      inverseSide: "channel",
    },
  },
});
