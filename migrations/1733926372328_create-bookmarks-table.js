/* eslint-disable no-unused-vars */

/**
 * Defines changes to be made to the database schema to accommodate new functionality.
 *
 * See {@link https://salsita.github.io/node-pg-migrate/#/migrations?id=defining-migrations the docs}.
 *
 * @param {MigrationBuilder} pgm
 * @returns {void | Promise<void>}
 */
exports.up = (pgm) => {
	pgm.createTable("bookmarks", {
		id: {
			default: pgm.func("gen_random_uuid()"),
			primaryKey: true,
			type: "UUID",
		},
		created_at: {
			default: pgm.func("NOW()"),
			type: "datetime",
		},
		user: {
			notNull: true,
			type: "UUID",
		},
		resource: {
			notNull: true,
			type: "UUID",
		},
	});

	pgm.createIndex("bookmarks", ["user", "resource"], { unique: true });

	pgm.addConstraint("bookmarks", "FK_bookmarks_users", {
		foreignKeys: {
			columns: "user",
			references: "users(id)",
		},
	});

	pgm.addConstraint("bookmarks", "FK_bookmarks_resources", {
		foreignKeys: {
			columns: "resource",
			references: "resources(id)",
		},
	});
};

/**
 * Reverses the "up" migration to return the database to its initial state.
 *
 * @param {MigrationBuilder} pgm
 * @returns {void | Promise<void>}
 */
exports.down = (pgm) => {
	pgm.dropIndex("bookmarks", ["user", "resource"]);
	pgm.dropConstraint("bookmarks", "FK_bookmarks_users");
	pgm.dropConstraint("bookmarks", "FK_bookmarks_resources");
	pgm.dropTable("bookmarks");
};

/**
 * Create new shorthand column definitions for this and any future migrations.
 *
 * @type {ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * Importing library types for less verbose type hints.
 * @typedef {import("node-pg-migrate").MigrationBuilder} MigrationBuilder
 * @typedef {import("node-pg-migrate").ColumnDefinitions} ColumnDefinitions
 */
