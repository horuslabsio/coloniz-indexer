CREATE TYPE "public"."follow_status" AS ENUM('followed', 'unfollowed');--> statement-breakpoint
CREATE TYPE "public"."gate_keep_type" AS ENUM('None', 'Token', 'NFT');--> statement-breakpoint
CREATE TYPE "public"."handle_status" AS ENUM('minted', 'linked', 'unlinked', 'burned');--> statement-breakpoint
CREATE TYPE "public"."premium_type" AS ENUM('Free', 'Premium', 'Business');--> statement-breakpoint
CREATE TYPE "public"."publication_type" AS ENUM('Comment', 'Repost', 'Post');--> statement-breakpoint
CREATE TYPE "public"."vote_type" AS ENUM('Upvote', 'Downvote');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "blocks" (
	"id" serial PRIMARY KEY NOT NULL,
	"block_timestamp" bigint NOT NULL,
	"unblock_timestamp" bigint,
	"is_blocked" boolean DEFAULT true,
	"blocker_profile_address" varchar(255),
	"blocked_profile_address" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "channel_banned_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"token_id" bigint,
	"timestamp" bigint NOT NULL,
	"executor" varchar(255) NOT NULL,
	"profile_address" varchar(255),
	"channel_id" bigint
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "channel_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"token_id" bigint,
	"timestamp" bigint NOT NULL,
	"executor" varchar(255) NOT NULL,
	"profile_address" varchar(255),
	"channel_id" bigint
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "channel_mods" (
	"id" serial PRIMARY KEY NOT NULL,
	"token_id" bigint,
	"timestamp" bigint NOT NULL,
	"executor" varchar(255) NOT NULL,
	"profile_address" varchar(255),
	"channel_id" bigint
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "channels" (
	"id" serial PRIMARY KEY NOT NULL,
	"channel_id" bigint NOT NULL,
	"channel_name" varchar(255),
	"channel_description" text,
	"created_timestamp" bigint NOT NULL,
	"total_number_of_posts" bigint DEFAULT 0,
	"total_number_of_upvotes" bigint DEFAULT 0,
	"total_amount_sent_in_jolts" bigint DEFAULT 0,
	"community_id" bigint,
	"channel_owner" varchar(255),
	CONSTRAINT "channels_channel_id_unique" UNIQUE("channel_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "community" (
	"id" serial PRIMARY KEY NOT NULL,
	"community_id" bigint NOT NULL,
	"community_name" varchar(255),
	"community_description" text,
	"logo" varchar(255),
	"community_nft_address" varchar(255),
	"total_number_of_posts" bigint DEFAULT 0,
	"total_number_of_upvotes" bigint DEFAULT 0,
	"total_amount_sent_in_jolts" bigint DEFAULT 0,
	"premium_type" "premium_type" DEFAULT 'Free' NOT NULL,
	"gate_keep_type" "gate_keep_type" DEFAULT 'None' NOT NULL,
	"created_timestamp" bigint,
	"cover_photo" varchar(255),
	"display_photo" varchar(255),
	"accent_color" varchar(255),
	"sub_domain" varchar(255),
	"domain" varchar(255),
	"community_owner" varchar(255),
	CONSTRAINT "community_community_id_unique" UNIQUE("community_id"),
	CONSTRAINT "community_sub_domain_unique" UNIQUE("sub_domain"),
	CONSTRAINT "community_domain_unique" UNIQUE("domain")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "community_banned_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"token_id" bigint,
	"timestamp" bigint NOT NULL,
	"executor" varchar(255) NOT NULL,
	"profile_address" varchar(255),
	"community_id" bigint
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "community_gate_keeps" (
	"id" serial PRIMARY KEY NOT NULL,
	"token_id" bigint,
	"timestamp" bigint NOT NULL,
	"executor" varchar(255) NOT NULL,
	"profile_address" varchar(255),
	"community_id" bigint
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "community_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"token_id" bigint,
	"timestamp" bigint NOT NULL,
	"executor" varchar(255) NOT NULL,
	"profile_address" varchar(255),
	"community_id" bigint
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "community_mods" (
	"id" serial PRIMARY KEY NOT NULL,
	"token_id" bigint,
	"timestamp" bigint NOT NULL,
	"executor" varchar(255) NOT NULL,
	"profile_address" varchar(255),
	"community_id" bigint
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "community_upgrades" (
	"id" serial PRIMARY KEY NOT NULL,
	"token_id" bigint,
	"timestamp" bigint NOT NULL,
	"executor" varchar(255) NOT NULL,
	"profile_address" varchar(255),
	"community_id" bigint
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "follows" (
	"id" serial PRIMARY KEY NOT NULL,
	"follow_id" bigint NOT NULL,
	"follow_timestamp" bigint NOT NULL,
	"unfollow_timestamp" bigint,
	"follow_status" "follow_status" DEFAULT 'unfollowed' NOT NULL,
	"follower_profile_address" varchar(255),
	"followed_profile_address" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "handles" (
	"id" serial PRIMARY KEY NOT NULL,
	"handle" varchar(255) NOT NULL,
	"handle_id" varchar(255) NOT NULL,
	"owner" varchar(255) NOT NULL,
	"status" "handle_status" DEFAULT 'minted' NOT NULL,
	"created_at" bigint NOT NULL,
	"profile_address" varchar(255),
	CONSTRAINT "handles_handle_unique" UNIQUE("handle"),
	CONSTRAINT "handles_handle_id_unique" UNIQUE("handle_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "jolts" (
	"id" serial PRIMARY KEY NOT NULL,
	"jolt_id" bigint NOT NULL,
	"jolt_type" varchar(255) NOT NULL,
	"amount" bigint DEFAULT 0,
	"created_timestamp" bigint NOT NULL,
	"sender" varchar(255),
	"recipient" varchar(255),
	CONSTRAINT "jolts_jolt_id_unique" UNIQUE("jolt_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"profile_address" varchar(255) NOT NULL,
	"profile_owner" varchar(255) NOT NULL,
	"email" varchar(255),
	"bio" text,
	"pub_count" bigint NOT NULL,
	"metadata_URI" varchar(255),
	"follow_nft" varchar(255),
	"created_at" bigint NOT NULL,
	"token_id" bigint,
	"display_name" varchar(255),
	"cover_photo" varchar(255),
	"display_photo" varchar(255),
	CONSTRAINT "profiles_profile_address_unique" UNIQUE("profile_address"),
	CONSTRAINT "profiles_email_unique" UNIQUE("email"),
	CONSTRAINT "profiles_follow_nft_unique" UNIQUE("follow_nft"),
	CONSTRAINT "profiles_token_id_unique" UNIQUE("token_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "publications" (
	"id" serial PRIMARY KEY NOT NULL,
	"pub_id" bigint NOT NULL,
	"content" text NOT NULL,
	"images" json,
	"publication_type" "publication_type" DEFAULT 'Post' NOT NULL,
	"pointed_profile_address" varchar(255),
	"pointed_pub_id" bigint,
	"root_profile_address" varchar(255),
	"root_pub_id" bigint,
	"upvote" bigint DEFAULT 0,
	"downvote" bigint DEFAULT 0,
	"total_comments" bigint DEFAULT 0,
	"total_reposts" bigint DEFAULT 0,
	"approved" boolean DEFAULT false,
	"tipped_amount" bigint DEFAULT 0,
	"created_at" timestamp NOT NULL,
	"creator" varchar(255),
	"channel_id" bigint,
	"community_id" bigint,
	CONSTRAINT "publications_pub_id_unique" UNIQUE("pub_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "votes" (
	"id" serial PRIMARY KEY NOT NULL,
	"vote_type" "vote_type" DEFAULT 'Upvote' NOT NULL,
	"created_at" timestamp NOT NULL,
	"publication_id" bigint,
	"creator" varchar(255)
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "blocks" ADD CONSTRAINT "blocks_blocker_profile_address_profiles_profile_address_fk" FOREIGN KEY ("blocker_profile_address") REFERENCES "public"."profiles"("profile_address") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "blocks" ADD CONSTRAINT "blocks_blocked_profile_address_profiles_profile_address_fk" FOREIGN KEY ("blocked_profile_address") REFERENCES "public"."profiles"("profile_address") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "channel_banned_members" ADD CONSTRAINT "channel_banned_members_profile_address_profiles_profile_address_fk" FOREIGN KEY ("profile_address") REFERENCES "public"."profiles"("profile_address") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "channel_banned_members" ADD CONSTRAINT "channel_banned_members_channel_id_channels_id_fk" FOREIGN KEY ("channel_id") REFERENCES "public"."channels"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "channel_members" ADD CONSTRAINT "channel_members_profile_address_profiles_profile_address_fk" FOREIGN KEY ("profile_address") REFERENCES "public"."profiles"("profile_address") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "channel_members" ADD CONSTRAINT "channel_members_channel_id_channels_id_fk" FOREIGN KEY ("channel_id") REFERENCES "public"."channels"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "channel_mods" ADD CONSTRAINT "channel_mods_profile_address_profiles_profile_address_fk" FOREIGN KEY ("profile_address") REFERENCES "public"."profiles"("profile_address") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "channel_mods" ADD CONSTRAINT "channel_mods_channel_id_channels_id_fk" FOREIGN KEY ("channel_id") REFERENCES "public"."channels"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "channels" ADD CONSTRAINT "channels_community_id_community_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."community"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "channels" ADD CONSTRAINT "channels_channel_owner_profiles_profile_address_fk" FOREIGN KEY ("channel_owner") REFERENCES "public"."profiles"("profile_address") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "community" ADD CONSTRAINT "community_community_owner_profiles_profile_address_fk" FOREIGN KEY ("community_owner") REFERENCES "public"."profiles"("profile_address") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "community_banned_members" ADD CONSTRAINT "community_banned_members_profile_address_profiles_profile_address_fk" FOREIGN KEY ("profile_address") REFERENCES "public"."profiles"("profile_address") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "community_banned_members" ADD CONSTRAINT "community_banned_members_community_id_community_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."community"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "community_gate_keeps" ADD CONSTRAINT "community_gate_keeps_profile_address_profiles_profile_address_fk" FOREIGN KEY ("profile_address") REFERENCES "public"."profiles"("profile_address") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "community_gate_keeps" ADD CONSTRAINT "community_gate_keeps_community_id_community_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."community"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "community_members" ADD CONSTRAINT "community_members_profile_address_profiles_profile_address_fk" FOREIGN KEY ("profile_address") REFERENCES "public"."profiles"("profile_address") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "community_members" ADD CONSTRAINT "community_members_community_id_community_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."community"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "community_mods" ADD CONSTRAINT "community_mods_profile_address_profiles_profile_address_fk" FOREIGN KEY ("profile_address") REFERENCES "public"."profiles"("profile_address") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "community_mods" ADD CONSTRAINT "community_mods_community_id_community_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."community"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "community_upgrades" ADD CONSTRAINT "community_upgrades_profile_address_profiles_profile_address_fk" FOREIGN KEY ("profile_address") REFERENCES "public"."profiles"("profile_address") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "community_upgrades" ADD CONSTRAINT "community_upgrades_community_id_community_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."community"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "follows" ADD CONSTRAINT "follows_follower_profile_address_profiles_profile_address_fk" FOREIGN KEY ("follower_profile_address") REFERENCES "public"."profiles"("profile_address") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "follows" ADD CONSTRAINT "follows_followed_profile_address_profiles_profile_address_fk" FOREIGN KEY ("followed_profile_address") REFERENCES "public"."profiles"("profile_address") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "handles" ADD CONSTRAINT "handles_profile_address_profiles_profile_address_fk" FOREIGN KEY ("profile_address") REFERENCES "public"."profiles"("profile_address") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "jolts" ADD CONSTRAINT "jolts_sender_profiles_profile_address_fk" FOREIGN KEY ("sender") REFERENCES "public"."profiles"("profile_address") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "jolts" ADD CONSTRAINT "jolts_recipient_profiles_profile_address_fk" FOREIGN KEY ("recipient") REFERENCES "public"."profiles"("profile_address") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "publications" ADD CONSTRAINT "publications_creator_profiles_profile_address_fk" FOREIGN KEY ("creator") REFERENCES "public"."profiles"("profile_address") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "publications" ADD CONSTRAINT "publications_channel_id_channels_id_fk" FOREIGN KEY ("channel_id") REFERENCES "public"."channels"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "publications" ADD CONSTRAINT "publications_community_id_community_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."community"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "votes" ADD CONSTRAINT "votes_publication_id_publications_id_fk" FOREIGN KEY ("publication_id") REFERENCES "public"."publications"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "votes" ADD CONSTRAINT "votes_creator_profiles_profile_address_fk" FOREIGN KEY ("creator") REFERENCES "public"."profiles"("profile_address") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
