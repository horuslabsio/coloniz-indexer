import { EntitySchema } from "../lib/typeorm.js";
import { type Profile } from "./profile.ts";

export type HandleStatus = "minted" | "linked" | "unlinked" | "burned";

export interface Handle {
  id: number;
  handle: string;
  handleId: string;
  owner: string;
  profileAddress: Profile;
  status: HandleStatus;
  createdAt: number;
}

// @ts-ignore
export const HandleSchema = new EntitySchema<Handle>({
  name: "Handle",
  tableName: "handles",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    handle: {
      type: String,
      unique: true,
    },
    handleId: {
      type: String,
      name: "handle_id",
      unique: true,
    },
    owner: {
      type: String,
    },
    status: {
      type: "enum",
      enum: ["minted", "linked", "unlinked", "burned"],
      default: "minted",
    },
    createdAt: {
      type: "bigint",
      name: "created_at",
    },
  },
  relations: {
    profileAddress: {
      type: "one-to-one",
      target: "Profile",
      joinColumn: {
        name: "profile_address",
      },
      nullable: true,
    },
  },
});
