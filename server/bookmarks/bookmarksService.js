import * as repository from "./bookmarksRepository";

export function findAll(userId) {
	return repository.findAll(userId);
}

export function add(userId, resourceId) {
	return repository.add(userId, resourceId);
}

export function remove(userId, resourceId) {
	return repository.remove(userId, resourceId);
}
