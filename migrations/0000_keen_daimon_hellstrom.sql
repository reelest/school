CREATE TABLE `buckets` (
	`index` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`bucket` text NOT NULL,
	`sha` text NOT NULL,
	`uploadTime` integer DEFAULT (date())
);
--> statement-breakpoint
CREATE INDEX `bucketIdx` ON `buckets` (`bucket`,`uploadTime`);