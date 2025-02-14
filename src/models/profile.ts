import { EntitySchema } from "typeorm";
import { Handle } from "./handle.ts";
import { CommunityMember } from "./member.ts";
import { CommunityMod } from "./member.ts";
import { Publication } from "./publication.ts";
import { Jolt } from "./jolt.ts";

export interface Profile {
  id: number;
  profileAddress: string;
  profileOwner: string;
  email: string | null;
  bio: string | null;
  handle: Handle;
  pubCount: number;
  metadataURI: string | null;
  followNft: string | null;
  createdAt: number;
  tokenId: number | null;
  displayName: string | null;
  coverPhoto: string | null;
  displayPhoto: string | null;
  communityMemberships: CommunityMember[];
  communityModerations: CommunityMod[];
  publications: Publication[];
  sentJolts: Jolt[];
  receivedJolts: Jolt[];
}

export const ProfileSchema = new EntitySchema<Profile>({
  name: "Profile",
  tableName: "profiles",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    profileAddress: {
      type: String,
      name: "profile_address",
      unique: true,
    },
    profileOwner: {
      type: String,
      name: "profile_owner",
    },
    email: {
      type: "text",
      nullable: true,
      unique: true,
    },
    bio: {
      type: "text",
      nullable: true,
    },
    pubCount: {
      type: "bigint",
      name: "pub_count",
    },
    metadataURI: {
      type: String,
      name: "metadata_URI",
      nullable: true,
    },
    followNft: {
      type: String,
      name: "follow_nft",
      unique: true,
      nullable: true,
    },
    createdAt: {
      type: "bigint",
      name: "created_at",
    },
    tokenId: {
      type: Number,
      name: "token_id",
      unique: true,
      nullable: true,
    },
    displayName: {
      type: String,
      name: "display_name",
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
  },
  relations: {
    handle: {
      type: "one-to-one",
      target: "Handle",
      joinColumn: {
        name: "handle_id",
      },
      nullable: true,
    },
    communityMemberships: {
      type: "one-to-many",
      target: "CommunityMember",
      inverseSide: "profile",
    },
    communityModerations: {
      type: "one-to-many",
      target: "CommunityMod",
      inverseSide: "profile",
    },
    publications: {
      type: "one-to-many",
      target: "Publication",
      inverseSide: "creator",
    },
    sentJolts: {
      type: "one-to-many",
      target: "Jolt",
      inverseSide: "sender",
    },
    receivedJolts: {
      type: "one-to-many",
      target: "Jolt",
      inverseSide: "recipient",
    },
  },
});
