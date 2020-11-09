import { Action } from '@ngrx/store';
import { CurrencyRate } from '../models/currency-rate';
import { CurrencyCodes } from '../types/currency-codes';
import {
  loadCurrencyRate,
  loadCurrencyRateFailure,
  loadCurrencyRateSuccess,
  setSelectedCurrency
} from './currency.actions';
import { initialState, reducer } from './currency.reducer';

export const sampleRates: { [key in CurrencyCodes]: number } = {
  AUD: 0,
  BGN: 0,
  BRL: 0,
  CAD: 0,
  CHF: 0,
  CNY: 0,
  CZK: 0,
  DKK: 0,
  EUR: 0,
  GBP: 0,
  HKD: 0,
  HRK: 0,
  HUF: 0,
  IDR: 0,
  ILS: 0,
  INR: 0,
  ISK: 0,
  JPY: 0,
  KRW: 0,
  MXN: 0,
  MYR: 0,
  NOK: 0,
  NZD: 0,
  PHP: 0,
  PLN: 0,
  RON: 0,
  RUB: 0,
  SEK: 0,
  SGD: 0,
  THB: 0,
  TRY: 0,
  USD: 0,
  ZAR: 0
};

describe('Currency Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('loadCurrencyRate', () => {
    it('should return the previous state', () => {
      const action = loadCurrencyRate({ currencyCode: 'ZAR' });

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('loadCurrencyRateSuccess', () => {
    it('should return state updated with new rate', () => {
      const currencyRate: CurrencyRate = {
        base: 'ZAR',
        date: '2020-11-07',
        rates: sampleRates
      };
      const action = loadCurrencyRateSuccess({ currencyRate });

      const result = reducer(initialState, action);

      expect(result.entities[currencyRate.base]).toBe(currencyRate);
    });
  });

  describe('loadCurrencyRateFailure', () => {
    it('should return the previous state', () => {
      const action = loadCurrencyRateFailure({ errorMessage: 'Error Message' });

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('setSelectedCurrency', () => {
    it('should return state with updated selectedCurrency', () => {
      const currencyCode: CurrencyCodes = 'ZAR';
      const action = setSelectedCurrency({ currencyCode });

      const result = reducer(initialState, action);

      expect(result.selectedCurrency).toBe(currencyCode);
    });
  });
});
