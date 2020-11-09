import { CurrencyCodes } from '../types/currency-codes';

export interface CurrencyRateHistory {
  base: CurrencyCodes;
  rates: {
    [date: string]: number;
  };
  start_at: string;
  end_at: string;
}

export interface CurrencyRateHistoryDto {
  base: CurrencyCodes;
  rates: {
    [date: string]: {
      [key in CurrencyCodes]: number;
    };
  };
  start_at: string;
  end_at: string;
}
