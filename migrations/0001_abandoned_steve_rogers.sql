CREATE TABLE `objects` (
	`sha` text NOT NULL,
	`content` blob
);
--> statement-breakpoint
CREATE UNIQUE INDEX `objects_sha_unique` ON `objects` (`sha`);--> statement-breakpoint
CREATE INDEX `sha` ON `objects` (`sha`);