describe('length-conversion', function () {
  beforeEach(function () {
    cy.server();
    cy.fixture('length-units.json').as('lengthUnits');

    cy.visit('/length');

    cy.get('demo-length-converter > div').as('component');
  });

  it('should load initial layout', function () {
    cy.get('@component').find('h2').contains('Length Converter');

    cy.get('@component').find('form').as('form');

    cy.get('@form').find('div[formGroupName="from"]').as('fromForm');
    cy.get('@fromForm').find('mat-form-field').should('have.length', 2);
    cy.get('@fromForm').find('mat-select[formControlName="unit"]');
    cy.get('@fromForm').find('input[formControlName="value"]');

    cy.get('@form').find('div[formGroupName="to"]').as('toForm');
    cy.get('@toForm').find('mat-form-field').should('have.length', 2);
    cy.get('@toForm').find('mat-select[formControlName="unit"]');
    cy.get('@toForm').find('input[formControlName="value"]');
  });

  describe('conversion tests', function () {
    beforeEach(function () {
      cy.get('@component').find('form').as('form');
      cy.get('@form').find('div[formGroupName="from"]').as('fromForm');
      cy.get('@form').find('div[formGroupName="to"]').as('toForm');
    });

    it('should convert to value when updating from value', function () {
      const value = '123';
      const fromRate = this.lengthUnits[0];
      const toUnit = 'centimeter';

      cy.get('@fromForm').find('input[formControlName="value"]').type(value);

      const unitKey = Object.keys(fromRate.rates).find((key) => key === toUnit);
      const unitValue: number = fromRate.rates[unitKey];

      const symbol = this.lengthUnits.find((unit) => unit.base === unitKey)
        .symbol;
      const expectedValue = unitValue * parseInt(value, 10);

      cy.get('@toForm')
        .find('input[formControlName="value"]')
        .should('have.value', `${expectedValue} ${symbol}`);
    });

    it('should convert from value when updating to value', function () {
      const value = '123';
      const fromRate = this.lengthUnits[0];
      const toUnit = 'centimeter';

      cy.get('@toForm').find('input[formControlName="value"]').type(value);

      const unitValue: number = fromRate.rates[toUnit];
      const symbol = fromRate.symbol;
      const expectedValue = parseInt(value, 10) / unitValue;

      cy.get('@fromForm')
        .find('input[formControlName="value"]')
        .should('have.value', `${expectedValue} ${symbol}`);
    });
  });
});
