import { CurrencyRate } from '../models/currency-rate';
import { CurrencyCodes } from '../types/currency-codes';
import { currencyFeatureKey, CurrencyState } from './currency.reducer';
import { sampleRates } from './currency.reducer.spec';
import {
  selectCurrencyRate,
  selectCurrencyRateEntities,
  selectCurrencyRateIds,
  selectCurrencyState,
  selectedCurrencyRate
} from './currency.selectors';

describe('Currency Selectors', () => {
  let state: CurrencyState;
  let currencyIds: CurrencyCodes[];
  let currencies: { [id: string]: CurrencyRate };

  beforeEach(() => {
    currencyIds = ['ZAR', 'USD', 'AUD'];
    currencies = {};
    currencyIds.forEach(
      (currencyId) =>
        (currencies[currencyId] = {
          base: currencyId,
          date: '2020-11-07',
          rates: sampleRates
        })
    );

    state = {
      ids: currencyIds,
      entities: currencies,
      selectedCurrency: null
    };
  });

  it('should select the feature state', () => {
    const result = selectCurrencyState({
      [currencyFeatureKey]: state
    });

    expect(result).toEqual(state);
  });

  describe('selectCurrencyRateIds', () => {
    it('should return ids state', () => {
      const result = selectCurrencyRateIds.projector(state);

      expect(result).toBe(state.ids);
    });
  });

  describe('selectCurrencyRateEntities', () => {
    it('should return entities state', () => {
      const result = selectCurrencyRateEntities.projector(state);

      expect(result).toBe(state.entities);
    });
  });

  describe('selectCurrencyRate', () => {
    it('should return currency rate state', () => {
      const currencyCode: CurrencyCodes = 'ZAR';
      const result = selectCurrencyRate.projector(state.entities, {
        currencyCode
      });

      expect(result).toBe(state.entities[currencyCode]);
    });
  });

  describe('selectCurrencyRate', () => {
    it('should return currency rate state', () => {
      state.selectedCurrency = currencyIds[2];
      const result = selectedCurrencyRate.projector(state);

      expect(result).toBe(state.selectedCurrency);
    });
  });
});
