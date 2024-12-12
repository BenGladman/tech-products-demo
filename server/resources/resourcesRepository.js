import db, { ErrorCodes, insertQuery, singleLine, updateQuery } from "../db";

import { DuplicateResource } from "./resourcesService";

const resourceQuerySelectFields = "SELECT r.*, t.name as topic_name";

const resourceQueryFromAndJoins = singleLine`
	FROM resources as r
	LEFT JOIN topics as t
	ON r.topic = t.id
`;

const resourceQueryFilterSortAndPaging = singleLine`
	WHERE draft = $1
	ORDER BY accession DESC
	LIMIT $2
	OFFSET $3;
`;

export const add = async ({ description, source, title, topic, url }) => {
	try {
		const {
			rows: [created],
		} = await db.query(
			insertQuery("resources", [
				"description",
				"source",
				"title",
				"topic",
				"url",
			]),
			[description, source, title, topic, url]
		);
		return created;
	} catch (err) {
		if (err.code === ErrorCodes.UNIQUE_VIOLATION) {
			throw new DuplicateResource();
		}
		throw err;
	}
};

export const count = async ({ draft }) => {
	const {
		rows: [{ count }],
	} = await db.query("SELECT COUNT(*) FROM resources WHERE draft = $1;", [
		draft,
	]);
	return parseInt(count, 10);
};

export const findAll = async ({ draft, limit, offset, userId }) => {
	if (userId) {
		const { rows } = await db.query(
			singleLine`
				${resourceQuerySelectFields}
				, (b IS NOT NULL) as is_bookmarked
				${resourceQueryFromAndJoins}
				LEFT JOIN bookmarks as b
				ON b.user = $4 AND b.resource = r.id
				${resourceQueryFilterSortAndPaging}
			`,
			[draft, limit, offset, userId]
		);

		return rows;
	}

	const { rows } = await db.query(
		singleLine`
			${resourceQuerySelectFields}
			${resourceQueryFromAndJoins}
			${resourceQueryFilterSortAndPaging}
		`,
		[draft, limit, offset]
	);

	return rows;
};

export const findOne = async (id) => {
	const {
		rows: [resource],
	} = await db.query(
		singleLine`
			${resourceQuerySelectFields}
			${resourceQueryFromAndJoins}
			WHERE r.id = $1;
		`,
		[id]
	);
	return resource;
};

export const update = async (id, { draft, publication, publisher }) => {
	const {
		rows: [updated],
	} = await db.query(
		updateQuery("resources", ["draft", "publication", "publisher"]),
		[id, draft, publication, publisher]
	);
	return updated;
};
