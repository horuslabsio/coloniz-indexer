import { defineIndexer } from "@apibara/indexer";
import { useLogger } from "@apibara/indexer/plugins";
import { drizzleStorage, useDrizzleStorage } from "@apibara/plugin-drizzle";
import { StarknetStream } from "@apibara/starknet";
import type { ApibaraRuntimeConfig } from "apibara/types";
import { hash } from "starknet";
import { handleMinted, handleBurnt, handleLinked, handleUnlinked } from "./handlers/handle.handlers";

// Define event selectors
const HANDLE_MINTED = hash.getSelectorFromName("HandleMinted") as `0x${string}`;
const HANDLE_BURNT = hash.getSelectorFromName("HandleBurnt") as `0x${string}`;
const HANDLE_LINKED = hash.getSelectorFromName("HandleLinked") as `0x${string}`;
const HANDLE_UNLINKED = hash.getSelectorFromName("HandleUnlinked") as `0x${string}`;

export default function (runtimeConfig: ApibaraRuntimeConfig) {
  const indexerId = "colonizIndexer";
  const { startingBlock, streamUrl, postgresConnectionString, colonizHubContractAddress } =
    runtimeConfig[indexerId];
  const { db } = useDrizzleStorage();

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
      const { events, header } = block;

      if (events.length === 0) {
        // logger.log(`No events found in block ${header?.blockNumber}`);
        return;
      }

      for (const event of events) {
        const eventKey = event.keys[0];

        switch (eventKey) {
          case HANDLE_MINTED:
            await handleMinted(event, db);
            break;
          case HANDLE_BURNT:
            await handleBurnt(event, db);
            break;
          case HANDLE_LINKED:
            await handleLinked(event, db);
            break;
          case HANDLE_UNLINKED:
            await handleUnlinked(event, db);
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
