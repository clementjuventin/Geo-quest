describe('Quest e2e', () => {
  beforeEach(() => {
    cy.visit("/");
  })

  it('Should create quest and add to quest list', () => {
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

    cy.get('[placeholder="Quest label"]')
      .should('exist')
      .type('test cypress quest{enter}');

    cy.get('[placeholder="Quest description"]')
      .should('exist')
      .type('test cypress quest description{enter}');

    cy.get('[type="date"]')
      .should('exist')
      .invoke('removeAttr','type')
      .type('2024-12-20{enter}');

    cy.get('[type="checkbox"]')
      .should('exist')
      .click();

    cy.get('[data-testid="submit"]').eq(1)
      .should('exist')
      .click();

    cy.contains("test cypress quest")
      .should("exist");
    cy.contains("Location")
      .should("not.exist");
  })

  it('Should view quest', () => {
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

    cy.get('[placeholder="Quest label"]')
      .should('exist')
      .type('test cypress quest{enter}');

    cy.get('[placeholder="Quest description"]')
      .should('exist')
      .type('test cypress quest description{enter}');

    cy.get('[type="date"]')
      .should('exist')
      .invoke('removeAttr','type')
      .type('2024-12-20{enter}');

    cy.get('[type="checkbox"]')
      .should('exist')
      .click();

    cy.get('[data-testid="submit"]').eq(1)
      .should('exist')
      .click();

    cy.get('[aria-label="test cypress quest"]')
      .click();

    cy.contains("Actions")
      .click();

    cy.contains("Edit")
      .click();

    cy.contains("Location")
      .should("exist");
  })

  it('Should share quest', () => {
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

    cy.get('[placeholder="Quest label"]')
      .should('exist')
      .type('test cypress quest{enter}');

    cy.get('[placeholder="Quest description"]')
      .should('exist')
      .type('test cypress quest description{enter}');

    cy.get('[type="date"]')
      .should('exist')
      .invoke('removeAttr','type')
      .type('2024-12-20{enter}');

    cy.get('[type="checkbox"]')
      .should('exist')
      .click();

    cy.get('[data-testid="submit"]').eq(1)
      .should('exist')
      .click();

    cy.get('[aria-label="test cypress quest"]')
      .click();

    cy.contains("Actions")
      .click();

    cy.contains("Share")
      .click();
  })

  it('Should create quest and add to quest list', () => {
    cy.get('[data-testid="login"]')
      .should('exist')
      .type('cle{enter}');

    cy.get('[data-testid="password"]')
      .should('exist')
      .type('test{enter}');

    cy.get('[data-testid="submit"]')
      .click();

    cy.contains('Join')
      .click();

    cy.get('[type="text"]').eq(1)
      .type("12345678901234567890123456789012{enter}")

    cy.get('[data-testid="submit"]').eq(1)
      .click();

    cy.contains('Paris tour')
      .should("exist");
  })
})
