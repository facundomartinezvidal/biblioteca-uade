CREATE TYPE "public"."book_status" AS ENUM('AVAILABLE', 'NOT_AVAILABLE', 'RESERVED');--> statement-breakpoint
CREATE TYPE "public"."campus" AS ENUM('MONSERRAT', 'COSTA', 'RECOLETA');--> statement-breakpoint
CREATE TABLE "authors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"middleName" text,
	"lastName" text NOT NULL,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "books" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"author" text NOT NULL,
	"description" text NOT NULL,
	"isbn" text NOT NULL,
	"book_status" "book_status" DEFAULT 'AVAILABLE' NOT NULL,
	"author_id" uuid NOT NULL,
	"gender_id" uuid NOT NULL,
	"location_id" uuid NOT NULL,
	"image_url" text,
	"created_at" text NOT NULL,
	CONSTRAINT "books_isbn_unique" UNIQUE("isbn")
);
--> statement-breakpoint
CREATE TABLE "genders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "locations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"address" text NOT NULL,
	"campus" "campus" NOT NULL
);
--> statement-breakpoint
ALTER TABLE "books" ADD CONSTRAINT "books_author_id_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "books" ADD CONSTRAINT "books_gender_id_genders_id_fk" FOREIGN KEY ("gender_id") REFERENCES "public"."genders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "books" ADD CONSTRAINT "books_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE no action ON UPDATE no action;