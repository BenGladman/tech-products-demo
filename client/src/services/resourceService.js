export default class ResourceService {
	static ENDPOINT = "/api/resources";

	constructor(request = fetch) {
		this.fetch = request;
	}

	async getDrafts() {
		const res = await this.fetch(
			`${ResourceService.ENDPOINT}?${new URLSearchParams({ draft: true })}`
		);
		if (res.ok) {
			const { resources } = await res.json();
			return resources.map(reviveResource);
		}
		return [];
	}

	async getPublished({ page, perPage } = {}) {
		const res = await this.fetch(
			`${ResourceService.ENDPOINT}?${new URLSearchParams(
				Object.entries({ page, perPage }).filter(
					([, value]) => value !== undefined
				)
			)}`
		);
		if (res.ok) {
			const { resources, ...rest } = await res.json();
			return { ...rest, resources: resources.map(reviveResource) };
		}
	}

	async publish(id) {
		const res = await this.fetch(`${ResourceService.ENDPOINT}/${id}`, {
			body: JSON.stringify({ draft: false }),
			headers: { "Content-Type": "application/json" },
			method: "PATCH",
		});
		if (res.ok) {
			return reviveResource(await res.json());
		}
	}

	async suggest(resource) {
		const res = await this.fetch(ResourceService.ENDPOINT, {
			body: JSON.stringify(resource),
			headers: { "Content-Type": "application/json" },
			method: "POST",
		});
		switch (res.status) {
			case 201:
				return reviveResource(await res.json());
			case 409:
				throw new Error("a very similar resource already exists");
			default:
				throw new Error("something went wrong");
		}
	}
}

export function reviveResource({ accession, publication, ...resource }) {
	return {
		...resource,
		accession: accession && new Date(accession),
		publication: publication && new Date(publication),
	};
}
