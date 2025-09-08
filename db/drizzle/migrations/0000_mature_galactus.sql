CREATE TABLE `community_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`roomId` integer,
	`authorId` integer,
	`products` integer NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`roomId`) REFERENCES `rooms_table`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`authorId`) REFERENCES `users_table`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "products_check1" CHECK("community_table"."products" BETWEEN 1 AND 10)
);
--> statement-breakpoint
CREATE TABLE `rooms_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`imageUrl` text NOT NULL,
	`imagePreviewUrl` text NOT NULL,
	`ownerId` integer,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`ownerId`) REFERENCES `users_table`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
