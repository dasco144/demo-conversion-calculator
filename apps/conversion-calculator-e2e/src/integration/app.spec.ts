describe('conversion-calculator', function () {
  let baseUrl: string;

  beforeEach(function () {
    baseUrl = Cypress.config().baseUrl;
    cy.visit('/');
  });

  it('should load initial layout', function () {
    cy.get('div.container').should('have.attr', 'fxLayout', 'column');

    cy.get('div.sidenav-content').should('have.attr', 'fxFlexFill');

    cy.get('mat-toolbar');
    cy.get('mat-drawer-container');
    cy.get('mat-toolbar > span').contains('Conversion Calculator');
    cy.get('mat-drawer').should('have.class', 'mat-drawer-opened');
  });

  it('should navigate to currency route from base route', function () {
    cy.url().should('eq', `${baseUrl}currency`);
    cy.get('demo-currency-converter');
  });

  it('should navigate to currency route from any route', function () {
    cy.visit('/abcdef');

    cy.url().should('eq', `${baseUrl}currency`);
    cy.get('demo-currency-converter');
  });

  it('should navigate to currency route via sidebar link', function () {
    cy.visit('/length');

    cy.get('mat-drawer mat-nav-list > mat-list-item:first-child').click();

    cy.url().should('eq', `${baseUrl}currency`);
    cy.get('demo-currency-converter');
  });

  it('should navigate to length route via sidebar link', function () {
    cy.get('mat-drawer mat-nav-list > mat-list-item:last-child').click();

    cy.url().should('eq', `${baseUrl}length`);
    cy.get('demo-length-converter');
  });

  it('should hide sidebar when clicking menu button', function () {
    cy.get('mat-toolbar button').click();

    cy.get('mat-drawer').should('not.have.class', 'mat-drawer-opened');
  });
});
