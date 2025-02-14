import { DataSource } from 'typeorm';
import { type HandleMintedEvent, type HandleBurnedEvent, type HandleLinkedEvent, type HandleUnlinkedEvent } from '../processors/handle';

export async function handleMintedEvent(
    event: HandleMintedEvent,
    db: DataSource
): Promise<void> {
    const { localName, tokenId, to, timestamp } = event;

    await db
        .createQueryBuilder()
        .insert()
        .into('handles')
        .values({
            handle: localName,
            handle_id: tokenId,
            owner: to,
            created_at: timestamp,
            status: 'minted',
        })
        .orIgnore()
        .execute();
}

export async function handleBurnedEvent(
    event: HandleBurnedEvent,
    db: DataSource
): Promise<void> {
    const { tokenId } = event;

    await db
        .createQueryBuilder()
        .update('handles')
        .set({ status: 'burned' })
        .where('handle_id = :tokenId', { tokenId })
        .execute();
}

export async function handleLinkedEvent(
    event: HandleLinkedEvent,
    db: DataSource
): Promise<void> {
    const { tokenId, profileAddress } = event;

    await db
        .createQueryBuilder()
        .update('handles')
        .set({
            profile_address: profileAddress,
            status: 'linked'
        })
        .where('handle_id = :tokenId', { tokenId })
        .execute();
}

export async function handleUnlinkedEvent(
    event: HandleUnlinkedEvent,
    db: DataSource
): Promise<void> {
    const { tokenId } = event;

    await db
        .createQueryBuilder()
        .update('handles')
        .set({
            profile_address: null,
            status: 'unlinked'
        })
        .where('handle_id = :tokenId', { tokenId })
        .execute();
}
