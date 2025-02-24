import { EntitySchema } from "../lib/typeorm.js";
import { type Profile } from "./profile.ts";
import { type Community } from "./community.ts";
import { type Channel } from "./channel.ts";

export enum PublicationType {
  Comment = "Comment",
  Repost = "Repost",
  Post = "Post",
}

export interface Publication {
  id: number;
  creator: Profile;
  pubId: number;
  content: string;
  images: string[];
  pubType: PublicationType;
  pointedProfileAddress: string | null;
  pointedPubId: number | null;
  rootProfileAddress: string | null;
  rootPubId: number | null;
  upvote: number;
  downvote: number;
  totalComments: number;
  totalReposts: number;
  channel: Channel | null;
  community: Community | null;
  approved: boolean;
  tippedAmount: number;
  createdAt: Date;
}

// @ts-ignore
export const PublicationSchema = new EntitySchema<Publication>({
  name: "Publication",
  tableName: "publications",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    pubId: {
      type: "bigint",
      name: "pub_id",
      unique: true,
    },
    content: {
      type: String,
    },
    images: {
      type: "json",
      nullable: true,
    },
    pubType: {
      type: "enum",
      enum: PublicationType,
      default: PublicationType.Post,
    },
    pointedProfileAddress: {
      type: String,
      nullable: true,
    },
    pointedPubId: {
      type: "bigint",
      nullable: true,
    },
    rootProfileAddress: {
      type: String,
      nullable: true,
    },
    rootPubId: {
      type: "bigint",
      nullable: true,
    },
    upvote: {
      type: "bigint",
      default: 0,
    },
    downvote: {
      type: "bigint",
      default: 0,
    },
    totalComments: {
      type: "bigint",
      default: 0,
    },
    totalReposts: {
      type: "bigint",
      default: 0,
    },
    approved: {
      type: Boolean,
      default: false,
    },
    tippedAmount: {
      type: "bigint",
      default: 0,
    },
    createdAt: {
      type: Date,
    },
  },
  relations: {
    creator: {
      type: "many-to-one",
      target: "Profile",
    },
    channel: {
      type: "many-to-one",
      target: "Channel",
      joinColumn: {
        name: "channel_id",
      },
      nullable: true,
    },
    community: {
      type: "many-to-one",
      target: "Community",
      joinColumn: {
        name: "community_id",
      },
      nullable: true,
    },
  },
});
