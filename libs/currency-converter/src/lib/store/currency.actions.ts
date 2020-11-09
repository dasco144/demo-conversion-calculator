import { createAction, props } from '@ngrx/store';
import { CurrencyRate } from '../models/currency-rate';
import { CurrencyCodes } from '../types/currency-codes';

export const loadCurrencyRate = createAction(
  '[Currency] Load Currency Rate',
  props<{ currencyCode: CurrencyCodes }>()
);

export const loadCurrencyRateSuccess = createAction(
  '[Currency] Load Currency Rate Success',
  props<{ currencyRate: CurrencyRate }>()
);

export const loadCurrencyRateFailure = createAction(
  '[Currency] Load Currency Rate Failure',
  props<{ errorMessage: string }>()
);

export const setSelectedCurrency = createAction(
  '[Currency] Set Selected Currency',
  props<{ currencyCode: CurrencyCodes }>()
);
