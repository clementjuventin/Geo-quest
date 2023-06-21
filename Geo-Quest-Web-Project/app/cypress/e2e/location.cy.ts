describe('Location e2e', () => {
  beforeEach(() => {
    cy.visit("/");
  })

  it('Should get history location', () => {
    cy.get('[data-testid="login"]')
      .should('exist')
      .type('tip{enter}');

    cy.get('[data-testid="password"]')
      .should('exist')
      .type('test{enter}');

    cy.get('[data-testid="submit"]')
      .click();

    cy.contains("ENSIMAG")
      .should('be.visible');
  })

  it('Should create location', () => {
    cy.get('[data-testid="login"]')
      .should('exist')
      .type('cle{enter}');

    cy.get('[data-testid="password"]')
      .should('exist')
      .type('test{enter}');

    cy.get('[data-testid="submit"]')
      .click();

    cy.contains('Navigation')
      .click();

    cy.contains('Create a quest')
      .click();

    cy.contains('Locations')
      .click();
    
    cy.contains('Add New Location')
      .click();

    cy.get('[placeholder="Location label"]')
      .should('exist')
      .type('test cypress location{enter}');

    cy.get('[placeholder="Location description"]')
      .should('exist')
      .type('test cypress location description{enter}');

    cy.contains('Coordinate')
      .click();

    cy.contains('MAP')
      .should("exist");
  })
})
