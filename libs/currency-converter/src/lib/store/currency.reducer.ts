import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { CurrencyRate } from '../models/currency-rate';
import { CurrencyCodes } from '../types/currency-codes';
import * as CurrencyActions from './currency.actions';

export const currencyFeatureKey = 'currency';

export const adapter = createEntityAdapter<CurrencyRate>({
  selectId: (rate) => rate.base
});

export interface CurrencyState extends EntityState<CurrencyRate> {
  selectedCurrency: CurrencyCodes;
}

export const initialState: CurrencyState = adapter.getInitialState({
  // additional entity state properties
  selectedCurrency: null
});

const userReducer = createReducer(
  initialState,
  on(CurrencyActions.loadCurrencyRate, (state) => state),
  on(CurrencyActions.loadCurrencyRateSuccess, (state, { currencyRate }) =>
    adapter.addOne(currencyRate, state)
  ),
  on(CurrencyActions.loadCurrencyRateFailure, (state) => state),
  on(CurrencyActions.setSelectedCurrency, (state, action) => ({
    ...state,
    selectedCurrency: action.currencyCode
  }))
);

export function reducer(state: CurrencyState | undefined, action: Action) {
  return userReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors();
