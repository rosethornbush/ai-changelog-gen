CREATE TABLE `changelogs` (
	`id` text PRIMARY KEY NOT NULL,
	`repo` text NOT NULL,
	`content` text NOT NULL,
	`created_at` text DEFAULT (current_timestamp)
);
