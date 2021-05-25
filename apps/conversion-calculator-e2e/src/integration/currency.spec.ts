import { getCurrencySymbol } from '@angular/common';

describe('currency-conversion', function () {
  beforeEach(function () {
    cy.server();
    cy.route('GET', 'https://api.exchangerate.host/latest?base=ZAR').as(
      'zarRates'
    );

    cy.visit('/currency');

    cy.get('demo-currency-converter > div').as('component');
  });

  it('should load initial layout', function () {
    cy.get('@component').find('h2').contains('Currency Converter');

    cy.get('@component').find('form').as('form');

    cy.get('@form').find('div[formGroupName="from"]').as('fromForm');
    cy.get('@fromForm').find('mat-form-field').should('have.length', 2);
    cy.get('@fromForm').find('mat-select[formControlName="currency"]');
    cy.get('@fromForm').find('input[formControlName="value"]');

    cy.get('@form').find('div[formGroupName="to"]').as('toForm');
    cy.get('@toForm').find('mat-form-field').should('have.length', 2);
    cy.get('@toForm').find('mat-select[formControlName="currency"]');
    cy.get('@toForm').find('input[formControlName="value"]');
  });

  describe('conversion tests', function () {
    beforeEach(function () {
      cy.get('@component').find('form').as('form');
      cy.get('@form').find('div[formGroupName="from"]').as('fromForm');
      cy.get('@form').find('div[formGroupName="to"]').as('toForm');
    });

    it('should convert to value when updating from value', function () {
      cy.wait('@zarRates').then((xhr) => {
        const zarRate = xhr.response.body as Cypress.ObjectLike;
        const value = '123';
        cy.get('@fromForm').find('input[formControlName="value"]').type(value);

        const rateKey = Object.keys(zarRate.rates).sort((a, b) =>
          a.localeCompare(b)
        )[0];
        const rateValue: number = zarRate.rates[rateKey];

        const symbol = getCurrencySymbol(rateKey, 'narrow');
        const expectedValue = rateValue * parseInt(value, 10);

        cy.get('@toForm')
          .find('input[formControlName="value"]')
          .should('have.value', `${symbol} ${expectedValue.toFixed(2)}`);
      });
    });

    it('should convert from value when updating to value', function () {
      cy.wait('@zarRates').then((xhr) => {
        const zarRate = xhr.response.body as Cypress.ObjectLike;
        const value = '123';
        const toCurrency = 'AED';

        cy.get('@toForm').find('input[formControlName="value"]').type(value);

        const rateKey = Object.keys(zarRate.rates).find(
          (key) => toCurrency === key
        );
        const rateValue: number = zarRate.rates[rateKey];

        const symbol = getCurrencySymbol(zarRate.base, 'narrow');
        const expectedValue = parseInt(value, 10) / rateValue;

        cy.get('@fromForm')
          .find('input[formControlName="value"]')
          .should('have.value', `${symbol} ${expectedValue.toFixed(2)}`);
      });
    });
  });
});
