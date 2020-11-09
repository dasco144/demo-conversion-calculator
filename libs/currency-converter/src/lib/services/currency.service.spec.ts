import { HttpClient } from '@angular/common/http';
import {
  fakeAsync,
  flushMicrotasks,
  TestBed,
  tick
} from '@angular/core/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of, throwError } from 'rxjs';
import { CurrencyRate } from '../models/currency-rate';
import {
  CurrencyRateHistory,
  CurrencyRateHistoryDto
} from '../models/currency-rate-history';
import { loadCurrencyRate } from '../store/currency.actions';
import { sampleRates } from '../store/currency.reducer.spec';
import { selectCurrencyRate } from '../store/currency.selectors';
import { CurrencyCodes } from '../types/currency-codes';
import { CurrencyService } from './currency.service';

describe('CurrencyService', () => {
  let service: CurrencyService;

  let store: MockStore;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj<HttpClient>('HttpClient', ['get']);

    TestBed.configureTestingModule({
      providers: [
        provideMockStore(),
        { provide: HttpClient, useValue: httpClientSpy }
      ]
    });

    service = TestBed.inject(CurrencyService);
    store = TestBed.inject(MockStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadCurrencyRate', () => {
    it('should dispatch loadCurrencyRate action', fakeAsync(() => {
      const currencyCode: CurrencyCodes = 'ZAR';
      service.loadCurrencyRate(currencyCode);

      let action: Action;
      store.scannedActions$.subscribe((res) => (action = res));
      tick();

      const expected = loadCurrencyRate({ currencyCode });
      expect(action).toEqual(expected);
    }));
  });

  describe('loadCurrencyRate', () => {
    it('should dispatch loadCurrencyRate action', fakeAsync(() => {
      const currencyCode: CurrencyCodes = 'ZAR';
      const currencyRate: CurrencyRate = {
        base: currencyCode,
        date: '2020-11-07',
        rates: sampleRates
      };
      store.overrideSelector(selectCurrencyRate, currencyRate);

      service.getCurrencyRate(currencyCode);

      let result: CurrencyRate;
      service.getCurrencyRate(currencyCode).subscribe((res) => (result = res));
      tick();

      expect(result).toEqual(currencyRate);
    }));
  });

  describe('getCurrencyRateHistory', () => {
    let base: CurrencyCodes;
    let compare: CurrencyCodes;
    let history: CurrencyRateHistoryDto;

    beforeEach(() => {
      base = 'ZAR';
      compare = 'AUD';
      history = {
        base,
        start_at: '2020-11-07',
        end_at: '2020-11-08',
        rates: {
          '2020-11-07': {
            [compare]: 1
          } as any,
          '2020-11-08': {
            [compare]: 1.2
          } as any
        }
      };
    });

    it('should get currency rate history and return processed result (week)', fakeAsync(() => {
      httpClientSpy.get.and.returnValue(of(history));

      let result: CurrencyRateHistory;
      service
        .getCurrencyRateHistory(base, compare, 'week')
        .then((res) => (result = res));

      tick();
      flushMicrotasks();

      const date = new Date();
      date.setDate(date.getDate() - 7);
      const startDate = date.toISOString().split('T')[0];
      const endDate = new Date().toISOString().split('T')[0];
      const expectedUrl = `https://api.ratesapi.io/api/history?base=${base}&symbols=${compare}&start_at=${startDate}&end_at=${endDate}`;

      expect(httpClientSpy.get).toHaveBeenCalledWith(expectedUrl);
      expect(result).toBeTruthy();
      expect(result).toEqual(
        jasmine.objectContaining({
          base: history.base,
          start_at: history.start_at,
          end_at: history.end_at
        })
      );
      expect(result.rates).toEqual(
        Object.entries(history.rates)
          .map((rate) => ({
            date: rate[0],
            value: Object.values(rate[1])[0]
          }))
          .sort((a, b) => a.date.localeCompare(b.date))
          .reduce((obj, item) => {
            obj[item.date] = Number(item.value.toFixed(5));
            return obj;
          }, {})
      );
    }));

    it('should get currency rate history and return processed result (month)', fakeAsync(() => {
      httpClientSpy.get.and.returnValue(of(history));

      let result: CurrencyRateHistory;
      service
        .getCurrencyRateHistory(base, compare, 'month')
        .then((res) => (result = res));

      tick();
      flushMicrotasks();

      const date = new Date();
      date.setMonth(date.getMonth() - 1);
      const startDate = date.toISOString().split('T')[0];
      const endDate = new Date().toISOString().split('T')[0];
      const expectedUrl = `https://api.ratesapi.io/api/history?base=${base}&symbols=${compare}&start_at=${startDate}&end_at=${endDate}`;

      expect(httpClientSpy.get).toHaveBeenCalledWith(expectedUrl);
      expect(result).toBeTruthy();
      expect(result).toEqual(
        jasmine.objectContaining({
          base: history.base,
          start_at: history.start_at,
          end_at: history.end_at
        })
      );
      expect(result.rates).toEqual(
        Object.entries(history.rates)
          .map((rate) => ({
            date: rate[0],
            value: Object.values(rate[1])[0]
          }))
          .sort((a, b) => a.date.localeCompare(b.date))
          .reduce((obj, item) => {
            obj[item.date] = Number(item.value.toFixed(5));
            return obj;
          }, {})
      );
    }));

    it('should get currency rate history and return processed result (year)', fakeAsync(() => {
      httpClientSpy.get.and.returnValue(of(history));

      let result: CurrencyRateHistory;
      service
        .getCurrencyRateHistory(base, compare, 'year')
        .then((res) => (result = res));

      tick();
      flushMicrotasks();

      const date = new Date();
      date.setFullYear(date.getFullYear() - 1);
      const startDate = date.toISOString().split('T')[0];
      const endDate = new Date().toISOString().split('T')[0];
      const expectedUrl = `https://api.ratesapi.io/api/history?base=${base}&symbols=${compare}&start_at=${startDate}&end_at=${endDate}`;

      expect(httpClientSpy.get).toHaveBeenCalledWith(expectedUrl);
      expect(result).toBeTruthy();
      expect(result).toEqual(
        jasmine.objectContaining({
          base: history.base,
          start_at: history.start_at,
          end_at: history.end_at
        })
      );
      expect(result.rates).toEqual(
        Object.entries(history.rates)
          .map((rate) => ({
            date: rate[0],
            value: Object.values(rate[1])[0]
          }))
          .sort((a, b) => a.date.localeCompare(b.date))
          .reduce((obj, item) => {
            obj[item.date] = Number(item.value.toFixed(5));
            return obj;
          }, {})
      );
    }));

    it('should handle error from api', fakeAsync(() => {
      const error = new Error('Api error');
      httpClientSpy.get.and.returnValue(throwError(error));
      const consoleSpy = spyOn(console, 'error');

      service
        .getCurrencyRateHistory(base, compare, 'month')
        .catch(() => fail());

      tick();
      flushMicrotasks();

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error occurred while attempting to get historical data for currency exchange rate',
        base,
        compare,
        error
      );
    }));
  });
});
