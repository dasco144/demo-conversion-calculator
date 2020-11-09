import { CurrencyRate } from '../models/currency-rate';
import { CurrencyCodes } from '../types/currency-codes';
import {
  loadCurrencyRate,
  loadCurrencyRateFailure,
  loadCurrencyRateSuccess,
  setSelectedCurrency
} from './currency.actions';
import { sampleRates } from './currency.reducer.spec';

describe('loadCurrencyRate', () => {
  it('should return an action', () => {
    const currencyCode: CurrencyCodes = 'ZAR';

    const action = loadCurrencyRate({ currencyCode });

    expect(action.type).toBe('[Currency] Load Currency Rate');
  });
});

describe('loadCurrencyRateSuccess', () => {
  it('should return an action', () => {
    const currencyRate: CurrencyRate = {
      base: 'ZAR',
      date: '2020-11-07',
      rates: sampleRates
    };

    const action = loadCurrencyRateSuccess({ currencyRate });

    expect(action.type).toBe('[Currency] Load Currency Rate Success');
  });
});

describe('loadCurrencyRateFailure', () => {
  it('should return an action', () => {
    const errorMessage = 'Unable to get rates';

    const action = loadCurrencyRateFailure({ errorMessage });

    expect(action.type).toBe('[Currency] Load Currency Rate Failure');
  });
});

describe('setSelectedCurrency', () => {
  it('should return an action', () => {
    const currencyCode: CurrencyCodes = 'ZAR';

    const action = setSelectedCurrency({ currencyCode });

    expect(action.type).toBe('[Currency] Set Selected Currency');
  });
});
