import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import { usePrincipal } from "../../authContext";
import { Button, ResourceList } from "../../components";
import { BookmarkService, useService } from "../../services";

import "./Account.scss";

export default function Account() {
	const principal = usePrincipal();
	const bookmarkService = useService(BookmarkService);

	const [{ resources } = {}, setEnvelope] = useState();

	useEffect(() => {
		bookmarkService.findAll().then(setEnvelope);
	}, [bookmarkService]);

	if (!principal) {
		return <Navigate to="/" />;
	}

	return (
		<>
			<h2>Account</h2>
			<table>
				<tbody>
					<tr>
						<th>Name</th>
						<td>{principal?.name}</td>
					</tr>
					<tr>
						<th>Email</th>
						<td>{principal?.email ?? <em>N/A</em>}</td>
					</tr>
				</tbody>
			</table>

			{resources && resources.length > 0 && (
				<div>
					<h3>Bookmarks</h3>
					<ResourceList
						resources={resources}
						onBookmark={bookmarkService.optimisticUpdate(
							resources,
							(newResources) => setEnvelope({ resources: newResources })
						)}
					/>
				</div>
			)}

			<form
				action="/api/auth/logout"
				aria-labelledby="logout-button"
				method="POST"
			>
				<Button id="logout-button" style="secondary">
					Log out
				</Button>
			</form>
		</>
	);
}
