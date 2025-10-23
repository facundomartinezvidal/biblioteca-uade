CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
	"apellido" text NOT NULL,
	"correo_institucional" text NOT NULL,
	"correo_personal" text NOT NULL,
	"dni" text NOT NULL,
	"legajo" text NOT NULL,
	"nombre" text NOT NULL,
	"status" boolean NOT NULL,
	"telefono_personal" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"id_rol" uuid NOT NULL DEFAULT gen_random_uuid(),
	"id_usuario" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id_rol" uuid PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
	"nombre_rol" text NOT NULL,
	"descripcion" text NOT NULL,
	"subcategoria" text NOT NULL,
	"sueldo_base" text NOT NULL,
	"status" boolean NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_id_usuario_users_id_fk" FOREIGN KEY ("id_usuario") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;