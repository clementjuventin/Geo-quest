describe('Login e2e', () => {
  beforeEach(() => {
    cy.visit("/");
  })

    it('Should display the login page', () => {
      cy.contains("Sign in to continue")
        .should('be.visible');
    })
  
    it('Should log in', () => {
      cy.get('[data-testid="login"]')
        .should('exist')
        .type('eva{enter}');
  
      cy.get('[data-testid="password"]')
        .should('exist')
        .type('test{enter}');
  
      cy.get('[data-testid="submit"]')
        .click();

      cy.contains("Ranking")
        .should('be.visible');
        
      cy.contains("eva")
        .should('be.visible');
    })
  })
