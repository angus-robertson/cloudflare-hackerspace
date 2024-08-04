CREATE TABLE `challenges` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`desc` text,
	`approved` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `challenges_name_unique` ON `challenges` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `name_idx` ON `challenges` (`name`);--> statement-breakpoint
CREATE INDEX `approved_idx` ON `challenges` (`approved`);