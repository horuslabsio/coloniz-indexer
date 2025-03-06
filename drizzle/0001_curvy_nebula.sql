CREATE TYPE "public"."document_status" AS ENUM('PROCESSING', 'COMPLETED', 'FAILED');--> statement-breakpoint
CREATE TYPE "public"."document_type" AS ENUM('FILE', 'FAQ', 'CRAWL');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "agent_documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"document_id" varchar(255),
	"s3_key" varchar(255),
	"original_name" varchar(255),
	"status" "document_status" DEFAULT 'PROCESSING' NOT NULL,
	"chunks_processed" integer DEFAULT 0 NOT NULL,
	"timestamp" bigint NOT NULL,
	"message" varchar(255),
	"document_type" "document_type" DEFAULT 'FILE' NOT NULL,
	"content" text,
	"url" varchar(255),
	"job_id" varchar(255),
	"community_id" bigint
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"order" integer DEFAULT 0,
	CONSTRAINT "categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "channel_message_reactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"emoji" varchar(50) NOT NULL,
	"timestamp" bigint NOT NULL,
	"message_id" varchar(255),
	"profile_id" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "channel_message_reads" (
	"id" serial PRIMARY KEY NOT NULL,
	"last_read_timestamp" bigint NOT NULL,
	"profile_id" varchar(255),
	"channel_id" bigint
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "channel_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"message_id" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"timestamp" bigint NOT NULL,
	"edited" boolean DEFAULT false,
	"edited_timestamp" bigint,
	"reply_to_id" varchar(255),
	"images" json,
	"sender_id" varchar(255),
	"channel_id" bigint,
	CONSTRAINT "channel_messages_message_id_unique" UNIQUE("message_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "collect_nfts" (
	"id" serial PRIMARY KEY NOT NULL,
	"nft_address" varchar(255) NOT NULL,
	"timestamp" bigint NOT NULL,
	"token_id" bigint NOT NULL,
	"publication_id" bigint,
	"owner_id" varchar(255),
	CONSTRAINT "collect_nfts_nft_address_unique" UNIQUE("nft_address")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "community_nfts" (
	"id" serial PRIMARY KEY NOT NULL,
	"nft_address" varchar(255) NOT NULL,
	"timestamp" bigint NOT NULL,
	"token_id" bigint NOT NULL,
	"community_id" bigint,
	"owner_id" varchar(255),
	CONSTRAINT "community_nfts_nft_address_unique" UNIQUE("nft_address")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "images" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nonces" (
	"id" serial PRIMARY KEY NOT NULL,
	"nonce" varchar(255) NOT NULL,
	"timestamp" bigint NOT NULL,
	"profile_id" varchar(255),
	CONSTRAINT "nonces_nonce_unique" UNIQUE("nonce")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" varchar(255) NOT NULL,
	"read" boolean DEFAULT false,
	"timestamp" bigint NOT NULL,
	"metadata" json,
	"recipient_id" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "publication_nfts" (
	"id" serial PRIMARY KEY NOT NULL,
	"nft_address" varchar(255) NOT NULL,
	"timestamp" bigint NOT NULL,
	"publication_id" bigint,
	CONSTRAINT "publication_nfts_nft_address_unique" UNIQUE("nft_address")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "referrals" (
	"id" serial PRIMARY KEY NOT NULL,
	"referral_code" varchar(255) NOT NULL,
	"status" varchar(255) DEFAULT 'PENDING',
	"timestamp" bigint NOT NULL,
	"referrer_id" varchar(255),
	"referee_id" varchar(255),
	CONSTRAINT "referrals_referral_code_unique" UNIQUE("referral_code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sub_colonies" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"timestamp" bigint NOT NULL,
	"community_id" bigint
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "agent_documents" ADD CONSTRAINT "agent_documents_community_id_community_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."community"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "channel_message_reactions" ADD CONSTRAINT "channel_message_reactions_message_id_channel_messages_message_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."channel_messages"("message_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "channel_message_reactions" ADD CONSTRAINT "channel_message_reactions_profile_id_profiles_profile_address_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_address") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "channel_message_reads" ADD CONSTRAINT "channel_message_reads_profile_id_profiles_profile_address_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_address") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "channel_message_reads" ADD CONSTRAINT "channel_message_reads_channel_id_channels_id_fk" FOREIGN KEY ("channel_id") REFERENCES "public"."channels"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "channel_messages" ADD CONSTRAINT "channel_messages_sender_id_profiles_profile_address_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."profiles"("profile_address") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "channel_messages" ADD CONSTRAINT "channel_messages_channel_id_channels_id_fk" FOREIGN KEY ("channel_id") REFERENCES "public"."channels"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "collect_nfts" ADD CONSTRAINT "collect_nfts_publication_id_publications_id_fk" FOREIGN KEY ("publication_id") REFERENCES "public"."publications"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "collect_nfts" ADD CONSTRAINT "collect_nfts_owner_id_profiles_profile_address_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."profiles"("profile_address") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "community_nfts" ADD CONSTRAINT "community_nfts_community_id_community_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."community"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "community_nfts" ADD CONSTRAINT "community_nfts_owner_id_profiles_profile_address_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."profiles"("profile_address") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nonces" ADD CONSTRAINT "nonces_profile_id_profiles_profile_address_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_address") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notifications" ADD CONSTRAINT "notifications_recipient_id_profiles_profile_address_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."profiles"("profile_address") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "publication_nfts" ADD CONSTRAINT "publication_nfts_publication_id_publications_id_fk" FOREIGN KEY ("publication_id") REFERENCES "public"."publications"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referrer_id_profiles_profile_address_fk" FOREIGN KEY ("referrer_id") REFERENCES "public"."profiles"("profile_address") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referee_id_profiles_profile_address_fk" FOREIGN KEY ("referee_id") REFERENCES "public"."profiles"("profile_address") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sub_colonies" ADD CONSTRAINT "sub_colonies_community_id_community_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."community"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
