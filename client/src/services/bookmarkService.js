import { reviveResource } from "./resourceService";

export default class BookmarkService {
	static ENDPOINT = "/api/bookmarks";

	constructor(request = fetch) {
		this.fetch = request;
	}

	async findAll() {
		const res = await this.fetch(BookmarkService.ENDPOINT);

		if (res.ok) {
			const result = await res.json();
			return {
				...result,
				resources: result.resources.map(reviveResource),
			};
		}
	}

	async add(resourceId) {
		await this.fetch(BookmarkService.ENDPOINT, {
			method: "POST",
			body: JSON.stringify({ resource: resourceId }),
			headers: { "Content-Type": "application/json" },
		});
	}

	async remove(resourceId) {
		await this.fetch(`${BookmarkService.ENDPOINT}?resource=${resourceId}`, {
			method: "DELETE",
		});
	}

	optimisticUpdate(originalResources, setResources) {
		return async (resourceId, isBookmarked) => {
			const updatedResources = originalResources.map((resource) => {
				if (resource.id === resourceId) {
					return {
						...resource,
						is_bookmarked: isBookmarked,
					};
				}

				return resource;
			});

			// optimistically update the UI for improved responsiveness
			setResources(updatedResources);

			try {
				if (isBookmarked) {
					await this.add(resourceId);
				} else {
					await this.remove(resourceId);
				}
			} catch (
				// eslint-disable-next-line no-unused-vars
				_error
			) {
				// update failed so revert bookmark flags in UI
				setResources(originalResources);

				// TODO report error to user
			}
		};
	}
}
