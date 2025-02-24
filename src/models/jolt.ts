import { EntitySchema } from "../lib/typeorm.js";
import { type Profile } from "./profile.ts";

export interface Jolt {
  id: number;
  joltId: number;
  joltType: string;
  sender: Profile;
  amount: number;
  recipient: Profile;
  createdTimestamp: number;
}

// @ts-ignore
export const JoltSchema = new EntitySchema<Jolt>({
  name: "Jolt",
  tableName: "jolts",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    joltId: {
      type: "bigint",
      name: "jolt_id",
      unique: true,
    },
    joltType: {
      type: String,
      name: "jolt_type",
    },
    amount: {
      type: "bigint",
      name: "amount",
      default: 0,
    },
    createdTimestamp: {
      type: "bigint",
      name: "created_timestamp",
    },
  },
  relations: {
    sender: {
      type: "many-to-one",
      target: "Profile",
    },
    recipient: {
      type: "many-to-one",
      target: "Profile",
    },
  },
});
