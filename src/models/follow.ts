import { EntitySchema } from "typeorm";
import { type Profile } from "./profile.ts";

export enum FollowStatus {
  followed = "followed",
  unfollowed = "unfollowed",
}

export interface Follow {
  id: number;
  follower: Profile;
  followed: Profile;
  followId: number;
  followTimestamp: number;
  unfollowTimestamp: number | null;
  status: FollowStatus;
}

export const FollowSchema = new EntitySchema<Follow>({
  name: "Follow",
  tableName: "follows",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    followId: {
      type: "bigint",
      name: "follow_id",
    },
    followTimestamp: {
      type: "bigint",
      name: "follow_timestamp",
    },
    unfollowTimestamp: {
      type: "bigint",
      name: "unfollow_timestamp",
      nullable: true,
    },
    status: {
      type: "enum",
      enum: FollowStatus,
      default: FollowStatus.unfollowed,
    },
  },
  relations: {
    follower: {
      type: "many-to-one",
      target: "Profile",
      joinColumn: {
        name: "follower_profile_address",
        referencedColumnName: "profileAddress",
      },
    },
    followed: {
      type: "many-to-one",
      target: "Profile",
      joinColumn: {
        name: "followed_profile_address",
        referencedColumnName: "profileAddress",
      },
    },
  },
});
