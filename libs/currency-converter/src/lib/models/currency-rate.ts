import { CurrencyCodes } from '../types/currency-codes';

export interface CurrencyRate {
  base: CurrencyCodes;
  rates: {
    [key in CurrencyCodes]?: number;
  };
  date: string;
}
