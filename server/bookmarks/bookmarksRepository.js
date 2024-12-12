import db, { ErrorCodes, insertQuery, singleLine } from "../db";

class DuplicateBookmark extends Error {}

export async function findAll(userId) {
	const { rows } = await db.query(
		singleLine`
		  SELECT r.*, t.name as topic_name, true as is_bookmarked
			FROM bookmarks as b
			LEFT JOIN resources as r
			ON b.resource = r.id
			LEFT JOIN topics as t
			ON r.topic = t.id
			WHERE b.user = $1
			ORDER BY created_at DESC
		`,
		[userId]
	);

	return rows;
}

export async function add(userId, resourceId) {
	try {
		const {
			rows: [created],
		} = await db.query(insertQuery("bookmarks", ["user", "resource"]), [
			userId,
			resourceId,
		]);
		return created;
	} catch (err) {
		if (err.code === ErrorCodes.UNIQUE_VIOLATION) {
			throw new DuplicateBookmark();
		}
		throw err;
	}
}

export async function remove(userId, resourceId) {
	await db.query(
		singleLine`
			DELETE FROM bookmarks WHERE ("user",resource) = ($1,$2);
		`,
		[userId, resourceId]
	);
}
