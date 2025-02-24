import { type CreateProfileEvent } from "../processors/createProfile.ts";
import { DataSource } from "https://esm.sh/v135/typeorm@0.3.20";

export async function handleCreateProfile(
  event: CreateProfileEvent,
  db: DataSource,
): Promise<void> {
  const { profileAddress, owner, tokenId, timestamp } = event;

  await db
    .createQueryBuilder()
    .insert()
    .into("profiles")
    .values({
      profile_address: profileAddress,
      profile_owner: owner,
      token_id: tokenId,
      created_at: timestamp,
    })
    .orUpdate(
      ["profile_owner", "token_id", "created_at"],
      ["profile_address"],
    )
    .execute();
}
