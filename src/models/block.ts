import { EntitySchema } from "typeorm";
import { type Profile } from "./profile.ts";

export interface Block {
  id: number;
  blocker: Profile;
  blocked: Profile;
  blockTimestamp: number;
  unblockTimestamp: number;
  isBlocked: boolean;
}

export const BlockSchema = new EntitySchema<Block>({
  name: "Block",
  tableName: "blocks",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    blockTimestamp: {
      type: "bigint",
      name: "block_timestamp",
    },
    unblockTimestamp: {
      type: "bigint",
      name: "unblock_timestamp",
      nullable: true,
    },
    isBlocked: {
      type: Boolean,
      name: "is_blocked",
      default: true,
    },
  },
  relations: {
    blocker: {
      type: "many-to-one",
      target: "Profile",
      joinColumn: {
        name: "blocker_profile_address",
        referencedColumnName: "profileAddress",
      },
    },
    blocked: {
      type: "many-to-one",
      target: "Profile",
      joinColumn: {
        name: "blocked_profile_address",
        referencedColumnName: "profileAddress",
      },
    },
  },
});
