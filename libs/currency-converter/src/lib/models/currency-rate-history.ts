import { CurrencyCodes } from '../types/currency-codes';

export interface CurrencyRateHistory {
  base: CurrencyCodes;
  rates: RateHistory;
  start_at: string;
  end_at: string;
}

export interface CurrencyRateHistoryDto {
  base: CurrencyCodes;
  rates: RateHistoryDto;
  start_at: string;
  end_at: string;
}

export interface RateHistory {
  [date: string]: number;
}

export interface RateHistoryDto {
  [date: string]: {
    [key in CurrencyCodes]?: number;
  };
}
