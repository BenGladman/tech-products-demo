import { useEffect, useState } from "react";

import { Pagination, ResourceList } from "../../components";
import { useSearchParams } from "../../hooks";
import { BookmarkService, ResourceService, useService } from "../../services";

export function Home() {
	const resourceService = useService(ResourceService);
	const bookmarkService = useService(BookmarkService);
	const searchParams = useSearchParams();
	const [{ lastPage, resources } = {}, setEnvelope] = useState();

	useEffect(() => {
		resourceService.getPublished(searchParams).then(setEnvelope);
	}, [resourceService, searchParams]);

	return (
		<section>
			<ResourceList
				resources={resources ?? []}
				onBookmark={bookmarkService.optimisticUpdate(
					resources,
					(newResources) => setEnvelope({ lastPage, resources: newResources })
				)}
			/>
			<Pagination lastPage={lastPage ?? 1} />
		</section>
	);
}

export default Home;
