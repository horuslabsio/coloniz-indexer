import { EntitySchema } from "../lib/typeorm.js";
import { type Profile } from "./profile.ts";
import { type Publication } from "./publication.ts";

export enum VoteType {
  Upvote = "Upvote",
  Downvote = "Downvote",
}

export interface Vote {
  id: number;
  publication: Publication;
  creator: Profile;
  voteType: VoteType;
  createdAt: Date;
}

// @ts-ignore
export const VoteSchema = new EntitySchema<Vote>({
  name: "Vote",
  tableName: "votes",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    voteType: {
      type: "enum",
      enum: VoteType,
      default: VoteType.Upvote,
    },
    createdAt: {
      type: Date,
      name: "created_at",
    },
  },
  relations: {
    publication: {
      type: "many-to-one",
      target: "Publication",
    },
    creator: {
      type: "many-to-one",
      target: "Profile",
    },
  },
});
