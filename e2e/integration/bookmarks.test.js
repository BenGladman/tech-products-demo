it("does not show bookmark button when not logged in", () => {
	cy.seed("onePublishedResource");
	cy.visit("/");
	cy.findByText("JS TDD Ohm").should("exist");
	cy.findByLabelText("Bookmark resource").should("not.exist");
});

it("lets user add and remove bookmark when logged in", () => {
	cy.seed("onePublishedResource");
	cy.visit("/");
	cy.logInAs("admin@codeyourfuture.io");
	cy.findByLabelText("Bookmark resource").should(
		"have.attr",
		"aria-pressed",
		"false"
	);

	// add bookmark
	cy.findByLabelText("Bookmark resource").click();
	cy.findByLabelText("Bookmark resource").should(
		"have.attr",
		"aria-pressed",
		"true"
	);

	// remove bookmark
	cy.findByLabelText("Bookmark resource").click();
	cy.findByLabelText("Bookmark resource").should(
		"have.attr",
		"aria-pressed",
		"false"
	);
});

it("shows user bookmarks on the account page", () => {
	cy.seed("onePublishedResource");
	cy.visit("/");
	cy.logInAs("admin@codeyourfuture.io");

	// confirm no booking initially
	cy.findByRole("link", { name: /account/i }).click();
	cy.findByText("JS TDD Ohm").should("not.exist");

	// add bookmark
	cy.findByRole("link", { name: /resources/i }).click();
	cy.findByLabelText("Bookmark resource").click();

	// bookmark section and bookmark link is now in the account page
	cy.findByRole("link", { name: /account/i }).click();
	cy.findByText("Bookmarks").should("exist");
	cy.findByText("JS TDD Ohm").should("exist");
});
