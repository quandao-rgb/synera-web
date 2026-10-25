CREATE TABLE `synera_demos` (
	`user_id` text PRIMARY KEY NOT NULL,
	`state` text NOT NULL,
	`version` integer DEFAULT 0 NOT NULL
);
