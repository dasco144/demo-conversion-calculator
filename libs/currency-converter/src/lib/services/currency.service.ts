import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CurrencyRate } from '../models/currency-rate';
import {
  CurrencyRateHistory,
  CurrencyRateHistoryDto
} from '../models/currency-rate-history';
import { loadCurrencyRate } from '../store/currency.actions';
import * as fromCurrency from '../store/currency.selectors';
import { CurrencyCodes } from '../types/currency-codes';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  constructor(private store: Store, private httpClient: HttpClient) {}

  loadCurrencyRate(currencyCode: CurrencyCodes): void {
    this.store.dispatch(loadCurrencyRate({ currencyCode }));
  }

  getCurrencyRate(currencyCode: CurrencyCodes): Observable<CurrencyRate> {
    return this.store.select(fromCurrency.selectCurrencyRate, { currencyCode });
  }

  // Get the historical data using async/await and httpClient
  async getCurrencyRateHistory(
    currencyCode: CurrencyCodes,
    compareRate: CurrencyCodes,
    period: 'week' | 'month' | 'year'
  ): Promise<CurrencyRateHistory> {
    try {
      const baseUrl = 'https://api.exchangerate.host/';
      const baseQueryParam = `base=${currencyCode}`;
      const symbolsQueryParam = `symbols=${compareRate}`;

      let startDate: Date;
      const endDate: Date = new Date();

      switch (period) {
        case 'month':
          startDate = new Date();
          startDate.setMonth(startDate.getMonth() - 1);
          break;

        case 'year':
          startDate = new Date();
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;

        case 'week':
        default:
          startDate = new Date();
          startDate.setDate(startDate.getDate() - 7);
          break;
      }

      const startDateString = startDate.toISOString().split('T')[0];
      const endDateString = endDate.toISOString().split('T')[0];

      const datesQueryParams = `start_at=${startDateString}&end_at=${endDateString}`;

      const url = `${baseUrl}history?${baseQueryParam}&${symbolsQueryParam}&${datesQueryParams}`;

      const historyDto = await this.httpClient
        .get<CurrencyRateHistoryDto>(url)
        .toPromise();

      const ratesMap = Object.entries(historyDto.rates)
        .map((rate) => ({
          date: rate[0],
          value: Object.values(rate[1])[0]
        }))
        .sort((a, b) => a.date.localeCompare(b.date))
        .reduce((obj, item) => {
          obj[item.date] = Number(item.value.toFixed(5));
          return obj;
        }, {});

      const historyData: CurrencyRateHistory = {
        base: historyDto.base,
        rates: ratesMap,
        start_at: historyDto.start_at,
        end_at: historyDto.end_at
      };

      return historyData;
    } catch (error) {
      console.error(
        'Error occurred while attempting to get historical data for currency exchange rate',
        currencyCode,
        compareRate,
        error
      );
    }
  }
}
