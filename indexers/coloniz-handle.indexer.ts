import { defineIndexer } from "@apibara/indexer";
import { useLogger } from "@apibara/indexer/plugins";
import { drizzleStorage, useDrizzleStorage } from "@apibara/plugin-drizzle";
import { decodeEvent, StarknetStream } from "@apibara/starknet";
import type { ApibaraRuntimeConfig } from "apibara/types";
import { getDrizzlePgDatabase } from "../lib/db";
import { hash } from "starknet";
import { coloniz_Handles, coloniz_HandleRegistry } from "abis";
import { handles } from "lib/schema";
import { bigIntToString } from "utils";
import { eq } from "drizzle-orm";

// Define event selectors
const HANDLE_MINTED = hash.getSelectorFromName("HandleMinted") as `0x${string}`;
const HANDLE_BURNT = hash.getSelectorFromName("HandleBurnt") as `0x${string}`;
const HANDLE_LINKED = hash.getSelectorFromName("HandleLinked") as `0x${string}`;
const HANDLE_UNLINKED = hash.getSelectorFromName("HandleUnlinked") as `0x${string}`;

export default function (runtimeConfig: ApibaraRuntimeConfig) {
  const indexerId = "colonizIndexer";
  const { startingBlock, streamUrl, postgresConnectionString, colonizHubContractAddress } =
    runtimeConfig[indexerId];
  const { db } = getDrizzlePgDatabase(postgresConnectionString);

  return defineIndexer(StarknetStream)({
    streamUrl,
    finality: "accepted",
    startingBlock: BigInt(startingBlock),
    filter: {
      header: "always",
      events: [
        {
          address: colonizHubContractAddress as `0x${string}`,
          keys: [
            HANDLE_MINTED,
            HANDLE_BURNT,
            HANDLE_LINKED,
            HANDLE_UNLINKED,
          ],
        },
      ],
    },
    plugins: [drizzleStorage({ db, persistState: true })],

    async transform({ endCursor, finality, block }) {
      const logger = useLogger();
      const { db } = useDrizzleStorage();
      const { events, header } = block;

      if (events.length === 0) {
        logger.log(`No events found in block ${header?.blockNumber}`);
        return;
      }

      for (const event of events) {
        const eventKey = event.keys[0];
        let decodedEvent;

        switch (eventKey) {
          case HANDLE_MINTED:
            decodedEvent = decodeEvent({
              abi: coloniz_Handles,
              eventName: "coloniz::namespaces::handles::Handles::HandleMinted",
              event: event,
            });

            const { local_name, token_id, to, block_timestamp } = decodedEvent.args;

            await db.insert(handles).values({
              handle: bigIntToString(local_name),
              handleId: String(token_id),
              owner: to,
              status: "minted",
              createdAt: Number(block_timestamp),
            });
            break;
          case HANDLE_BURNT:
            decodedEvent = decodeEvent({
              abi: coloniz_Handles,
              eventName: "coloniz::namespaces::handles::Handles::HandleBurnt",
              event: event,
            });

            await db.update(handles)
              .set({ status: "burned" })
              .where(eq(handles.handleId, String(decodedEvent.args.token_id)));
            break;
          case HANDLE_LINKED:
            decodedEvent = decodeEvent({
              abi: coloniz_HandleRegistry,
              eventName: "coloniz::namespaces::handle_registry::HandleRegistry::HandleLinked",
              event: event,
            });

            await db.update(handles)
              .set({ status: "linked", profileAddress: decodedEvent.args.profile_address })
              .where(eq(handles.handleId, String(decodedEvent.args.handle_id)));

            break;
          case HANDLE_UNLINKED:
            decodedEvent = decodeEvent({
              abi: coloniz_HandleRegistry,
              eventName: "coloniz::namespaces::handle_registry::HandleRegistry::HandleUnlinked",
              event: event,
            });
            await db.update(handles)
              .set({ status: "unlinked", profileAddress: null })
              .where(eq(handles.handleId, String(decodedEvent.args.handle_id)));
            break;
          default:
            logger.log(`Unknown event key: ${eventKey}`);
            break;
        }
      }

      logger.info(
        "Transforming block | orderKey: ",
        endCursor?.orderKey,
        " | finality: ",
        finality,
      );
    },
  });
}
