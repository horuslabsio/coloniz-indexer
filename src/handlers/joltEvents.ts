import { DataSource } from "typeorm";
import { type JoltEvent } from "../processors/joltProcessors.ts";
import { JoltType } from "../processors/joltProcessors.ts";

export async function handleJoltEvent(
  event: JoltEvent,
  db: DataSource,
): Promise<void> {
  const { joltId, joltType, sender, amount, recipient, timestamp } = event;

  await db
    .createQueryBuilder()
    .insert()
    .into("jolts")
    .values({
      jolt_id: joltId,
      jolt_type: joltType,
      sender_address: sender,
      amount,
      recipient_address: recipient,
      created_timestamp: timestamp,
    })
    .orIgnore()
    .execute();
}

export async function handleJoltRequestEvent(
  event: JoltEvent,
  db: DataSource,
): Promise<void> {
  await handleJoltEvent(
    {
      ...event,
      joltType: JoltType.Request,
    },
    db,
  );
}

export async function handleJoltFulfillmentEvent(
  joltId: number,
  db: DataSource,
): Promise<void> {
  await db
    .createQueryBuilder()
    .update("jolts")
    .set({
      jolt_type: JoltType.Transfer,
    })
    .where("jolt_id = :joltId AND jolt_type = :requestType", {
      joltId,
      requestType: JoltType.Request,
    })
    .execute();
}
