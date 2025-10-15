CREATE TYPE "public"."loan_status" AS ENUM('RESERVED', 'ACTIVE', 'FINISHED', 'EXPIRED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('LOANS_DEADLINE', 'LOANS_EXPIRED', 'USER_PENALIZED');--> statement-breakpoint
CREATE TABLE "favorites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"book_id" uuid NOT NULL,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "loans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"book_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"end_date" text NOT NULL,
	"loan_status" "loan_status" DEFAULT 'RESERVED' NOT NULL,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"notification_type" "notification_type" NOT NULL,
	"created_at" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "books" DROP CONSTRAINT "books_location_id_locations_id_fk";
--> statement-breakpoint
ALTER TABLE "books" ALTER COLUMN "location_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "books" ALTER COLUMN "location_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "year" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "editorial" text NOT NULL;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loans" ADD CONSTRAINT "loans_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "books" DROP COLUMN "author";