import { decodeEvent } from "@apibara/starknet";
import { coloniz_Handles, coloniz_HandleRegistry } from "abis";
import { handles } from "lib/schema";
import { bigIntToString } from "utils";
import { eq } from "drizzle-orm";
import { useLogger } from "@apibara/indexer/plugins";
import type { PgDatabase } from "drizzle-orm/pg-core";

export async function handleMinted(event: any, db: PgDatabase<any, any, any>) {
    const decodedEvent = decodeEvent({
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
}

export async function handleBurnt(event: any, db: PgDatabase<any, any, any>) {
    const decodedEvent = decodeEvent({
        abi: coloniz_Handles,
        eventName: "coloniz::namespaces::handles::Handles::HandleBurnt",
        event: event,
    });

    await db.update(handles)
        .set({ status: "burned" })
        .where(eq(handles.handleId, String(decodedEvent.args.token_id)));
}

export async function handleLinked(event: any, db: PgDatabase<any, any, any>) {
    const decodedEvent = decodeEvent({
        abi: coloniz_HandleRegistry,
        eventName: "coloniz::namespaces::handle_registry::HandleRegistry::HandleLinked",
        event: event,
    });

    await db.update(handles)
        .set({ status: "linked", profileAddress: decodedEvent.args.profile_address })
        .where(eq(handles.handleId, String(decodedEvent.args.handle_id)));
}

export async function handleUnlinked(event: any, db: PgDatabase<any, any, any>) {
    const decodedEvent = decodeEvent({
        abi: coloniz_HandleRegistry,
        eventName: "coloniz::namespaces::handle_registry::HandleRegistry::HandleUnlinked",
        event: event,
    });

    await db.update(handles)
        .set({ status: "unlinked", profileAddress: null })
        .where(eq(handles.handleId, String(decodedEvent.args.handle_id)));
}

// export async function handleHandleTaken(event: any, db: PgDatabase<any, any, any>) {
//     const decodedEvent = decodeEvent({
//         abi: coloniz_Handle,
//         eventName: "coloniz::handle::handle::HandleComponent::HandleTaken",
//         event: event,
//     });

//     // ... existing code ...
// }

// export async function handleHandleReleased(event: any, db: PgDatabase<any, any, any>) {
//     const decodedEvent = decodeEvent({
//         abi: coloniz_Handle,
//         eventName: "coloniz::handle::handle::HandleComponent::HandleReleased",
//         event: event,
//     });

//     // ... existing code ...
// } 