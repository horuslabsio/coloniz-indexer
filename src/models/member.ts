import { EntitySchema } from 'typeorm';
import { type Profile } from './profile';
import { type Community } from './community';
import { type Channel } from './channel';

export interface Member {
    id: number;
    profile: Profile;
    tokenId: number | null;
    timestamp: number;
    executor: string;
}

export interface ChannelMember extends Member {
    channel: Channel;
}

export interface ChannelMod extends Member {
    channel: Channel;
}

export interface ChannelBannedMember extends Member {
    channel: Channel;
}

export interface CommunityMember extends Member {
    community: Community;
}

export interface CommunityMod extends Member {
    community: Community;
}

export interface CommunityBannedMember extends Member {
    community: Community;
}

export interface CommunityUpgraded extends Member {
    community: Community;
}

export interface CommunityGateKeeped extends Member {
    community: Community;
}

export const MemberSchema = new EntitySchema<Member>({
    name: 'Member',
    tableName: 'members',
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true,
        },
        tokenId: {
            type: 'bigint',
            name: 'token_id',
            nullable: true,
        },
        timestamp: {
            type: 'bigint',
            name: 'timestamp',
        },
        executor: {
            type: String,
            name: 'executor',
        },
    },
    relations: {
        profile: {
            type: 'many-to-one',
            target: 'Profile',
            joinColumn: {
                name: 'profile_address',
            },
        },
    },
});

export const ChannelMemberSchema = new EntitySchema<ChannelMember>({
    name: 'ChannelMember',
    tableName: 'channel_members',
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true,
        },
        tokenId: {
            type: 'bigint',
            name: 'token_id',
            nullable: true,
        },
        timestamp: {
            type: 'bigint',
            name: 'timestamp',
        },
        executor: {
            type: String,
            name: 'executor',
        },
    },
    relations: {
        profile: {
            type: 'many-to-one',
            target: 'Profile',
            joinColumn: {
                name: 'profile_address',
            },
        },
        channel: {
            type: 'many-to-one',
            target: 'Channel',
            joinColumn: {
                name: 'channel_id',
            },
        },
    },
});

export const ChannelModSchema = new EntitySchema<ChannelMod>({
    name: 'ChannelMod',
    tableName: 'channel_mods',
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true,
        },
        tokenId: {
            type: 'bigint',
            name: 'token_id',
            nullable: true,
        },
        timestamp: {
            type: 'bigint',
            name: 'timestamp',
        },
        executor: {
            type: String,
            name: 'executor',
        },
    },
    relations: {
        profile: {
            type: 'many-to-one',
            target: 'Profile',
            joinColumn: {
                name: 'profile_address',
            },
        },
        channel: {
            type: 'many-to-one',
            target: 'Channel',
            joinColumn: {
                name: 'channel_id',
            },
        },
    },
});

export const ChannelBannedMemberSchema = new EntitySchema<ChannelBannedMember>({
    name: 'ChannelBannedMember',
    tableName: 'channel_banned_members',
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true,
        },
        tokenId: {
            type: 'bigint',
            name: 'token_id',
            nullable: true,
        },
        timestamp: {
            type: 'bigint',
            name: 'timestamp',
        },
        executor: {
            type: String,
            name: 'executor',
        },
    },
    relations: {
        profile: {
            type: 'many-to-one',
            target: 'Profile',
            joinColumn: {
                name: 'profile_address',
            },
        },
        channel: {
            type: 'many-to-one',
            target: 'Channel',
            joinColumn: {
                name: 'channel_id',
            },
        },
    },
});

export const CommunityMemberSchema = new EntitySchema<CommunityMember>({
    name: 'CommunityMember',
    tableName: 'community_members',
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true,
        },
        tokenId: {
            type: 'bigint',
            name: 'token_id',
            nullable: true,
        },
        timestamp: {
            type: 'bigint',
            name: 'timestamp',
        },
        executor: {
            type: String,
            name: 'executor',
        },
    },
    relations: {
        profile: {
            type: 'many-to-one',
            target: 'Profile',
            joinColumn: {
                name: 'profile_address',
            },
        },
        community: {
            type: 'many-to-one',
            target: 'Community',
            joinColumn: {
                name: 'community_id',
            },
        },
    },
});

export const CommunityModSchema = new EntitySchema<CommunityMod>({
    name: 'CommunityMod',
    tableName: 'community_mods',
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true,
        },
        tokenId: {
            type: 'bigint',
            name: 'token_id',
            nullable: true,
        },
        timestamp: {
            type: 'bigint',
            name: 'timestamp',
        },
        executor: {
            type: String,
            name: 'executor',
        },
    },
    relations: {
        profile: {
            type: 'many-to-one',
            target: 'Profile',
            joinColumn: {
                name: 'profile_address',
            },
        },
        community: {
            type: 'many-to-one',
            target: 'Community',
            joinColumn: {
                name: 'community_id',
            },
        },
    },
});

export const CommunityBannedMemberSchema = new EntitySchema<CommunityBannedMember>({
    name: 'CommunityBannedMember',
    tableName: 'community_banned_memebers',
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true,
        },
        tokenId: {
            type: 'bigint',
            name: 'token_id',
            nullable: true,
        },
        timestamp: {
            type: 'bigint',
            name: 'timestamp',
        },
        executor: {
            type: String,
            name: 'executor',
        },
    },
    relations: {
        profile: {
            type: 'many-to-one',
            target: 'Profile',
            joinColumn: {
                name: 'profile_address',
            },
        },
        community: {
            type: 'many-to-one',
            target: 'Community',
            joinColumn: {
                name: 'community_id',
            },
        },
    },
});

export const CommunityUpgradedSchema = new EntitySchema<CommunityUpgraded>({
    name: 'CommunityUpgraded',
    tableName: 'community_upgrades',
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true,
        },
        tokenId: {
            type: 'bigint',
            name: 'token_id',
            nullable: true,
        },
        timestamp: {
            type: 'bigint',
            name: 'timestamp',
        },
        executor: {
            type: String,
            name: 'executor',
        },
    },
    relations: {
        profile: {
            type: 'many-to-one',
            target: 'Profile',
            joinColumn: {
                name: 'profile_address',
            },
        },
        community: {
            type: 'many-to-one',
            target: 'Community',
            joinColumn: {
                name: 'community_id',
            },
        },
    },
});

export const CommunityGateKeepedSchema = new EntitySchema<CommunityGateKeeped>({
    name: 'CommunityGateKeeped',
    tableName: 'community_gate_keeps',
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true,
        },
        tokenId: {
            type: 'bigint',
            name: 'token_id',
            nullable: true,
        },
        timestamp: {
            type: 'bigint',
            name: 'timestamp',
        },
        executor: {
            type: String,
            name: 'executor',
        },
    },
    relations: {
        profile: {
            type: 'many-to-one',
            target: 'Profile',
            joinColumn: {
                name: 'profile_address',
            },
        },
        community: {
            type: 'many-to-one',
            target: 'Community',
            joinColumn: {
                name: 'community_id',
            },
        },
    },
});
