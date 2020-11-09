import { Dictionary } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CurrencyRate } from '../models/currency-rate';
import * as fromCurrency from './currency.reducer';

export const selectCurrencyState = createFeatureSelector<
  fromCurrency.CurrencyState
>(fromCurrency.currencyFeatureKey);

export const selectCurrencyRateIds = createSelector(
  selectCurrencyState,
  fromCurrency.selectIds
);

export const selectCurrencyRateEntities = createSelector(
  selectCurrencyState,
  fromCurrency.selectEntities
);

export const selectCurrencyRate = createSelector(
  selectCurrencyRateEntities,
  (entities: Dictionary<CurrencyRate>, props: { currencyCode: string }) =>
    entities[props.currencyCode]
);

export const selectedCurrencyRate = createSelector(
  selectCurrencyState,
  (state) => state.selectedCurrency
);
