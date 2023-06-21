describe('Signup e2e', () => {
  beforeEach(() => {
    cy.visit("/");
  })

  it('Should display the signup page', () => {
    cy.get('[data-testid="signup"]')
      .click();

    cy.contains("Choose your login and password")
      .should('be.visible');
  })
})
