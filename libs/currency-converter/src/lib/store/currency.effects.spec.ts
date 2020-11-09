import { HttpClient } from '@angular/common/http';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable, of, throwError } from 'rxjs';
import { skip, take } from 'rxjs/operators';
import { CurrencyRate } from '../models/currency-rate';
import { CurrencyCodes } from '../types/currency-codes';
import {
  loadCurrencyRate,
  loadCurrencyRateFailure,
  loadCurrencyRateSuccess,
  setSelectedCurrency
} from './currency.actions';
import { CurrencyEffects } from './currency.effects';
import { sampleRates } from './currency.reducer.spec';
import { selectCurrencyRate } from './currency.selectors';

describe('CurrencyEffects', () => {
  let actions$: Observable<Action>;
  let effects: CurrencyEffects;

  let store: MockStore;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let matSnackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj<HttpClient>('HttpClient', ['get']);

    matSnackBarSpy = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      providers: [
        CurrencyEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: MatSnackBar, useValue: matSnackBarSpy }
      ]
    });

    effects = TestBed.inject(CurrencyEffects);
    store = TestBed.inject(MockStore);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('loadCurrencyRate$', () => {
    it('should trigger from loadCurrencyRate action and dispatch loadCurrencyRateSuccess and setSelectedCurrency actions', fakeAsync(() => {
      const currencyRate: CurrencyRate = {
        base: 'AUD',
        date: '2020-11-07',
        rates: sampleRates
      };

      store.overrideSelector(selectCurrencyRate, undefined);

      actions$ = of(loadCurrencyRate({ currencyCode: currencyRate.base }));

      httpClientSpy.get.and.returnValue(of(currencyRate));

      const expected1 = loadCurrencyRateSuccess({ currencyRate });
      let result1: TypedAction<'[Currency] Load Currency Rate Success'>;

      effects.loadCurrencyRate$
        .pipe(take(1))
        .subscribe(
          (action) =>
            (result1 = action as TypedAction<
              '[Currency] Load Currency Rate Success'
            >)
        );

      tick();

      expect(httpClientSpy.get).toHaveBeenCalledWith(
        `${effects.basePath}?base=${currencyRate.base}`
      );
      expect(result1).toEqual(expected1);

      const expected2 = setSelectedCurrency({
        currencyCode: currencyRate.base
      });

      let result2: TypedAction<'[Currency] Set Selected Currency'>;
      effects.loadCurrencyRate$
        .pipe(skip(1), take(1))
        .subscribe(
          (action) =>
            (result2 = action as TypedAction<
              '[Currency] Set Selected Currency'
            >)
        );

      tick();

      expect(result2).toEqual(expected2);
    }));

    it('should handle no currency code', fakeAsync(() => {
      const currencyRate: CurrencyRate = {
        base: 'ZAR',
        date: '2020-11-07',
        rates: sampleRates
      };

      store.overrideSelector(selectCurrencyRate, undefined);

      actions$ = of(loadCurrencyRate({ currencyCode: '' as CurrencyCodes }));

      httpClientSpy.get.and.returnValue(of(currencyRate));

      const expected1 = loadCurrencyRateSuccess({ currencyRate });
      let result1: TypedAction<'[Currency] Load Currency Rate Success'>;

      effects.loadCurrencyRate$
        .pipe(take(1))
        .subscribe(
          (action) =>
            (result1 = action as TypedAction<
              '[Currency] Load Currency Rate Success'
            >)
        );

      tick();

      expect(httpClientSpy.get).toHaveBeenCalledWith(
        `${effects.basePath}?base=${currencyRate.base}`
      );
      expect(result1).toEqual(expected1);

      const expected2 = setSelectedCurrency({
        currencyCode: currencyRate.base
      });

      let result2: TypedAction<'[Currency] Set Selected Currency'>;
      effects.loadCurrencyRate$
        .pipe(skip(1), take(1))
        .subscribe(
          (action) =>
            (result2 = action as TypedAction<
              '[Currency] Set Selected Currency'
            >)
        );

      tick();

      expect(result2).toEqual(expected2);
    }));

    it('should not send request if result is in store already', fakeAsync(() => {
      const currencyRate: CurrencyRate = {
        base: 'ZAR',
        date: '2020-11-07',
        rates: sampleRates
      };

      store.overrideSelector(selectCurrencyRate, currencyRate);

      actions$ = of(loadCurrencyRate({ currencyCode: currencyRate.base }));

      let result: Action;
      effects.loadCurrencyRate$.subscribe((action) => (result = action));

      tick();

      expect(result).toBeUndefined();
      expect(httpClientSpy.get).not.toHaveBeenCalled();
    }));

    it('should handle error from http client and dispatch loadCurrencyRateFailure action', fakeAsync(() => {
      const error = new Error('Error message');

      store.overrideSelector(selectCurrencyRate, undefined);

      actions$ = of(loadCurrencyRate({ currencyCode: '' as CurrencyCodes }));

      httpClientSpy.get.and.returnValue(throwError(error));

      const expected = loadCurrencyRateFailure({ errorMessage: error.message });
      let result: TypedAction<'[Currency] Load Currency Rate Failure'>;

      effects.loadCurrencyRate$.subscribe(
        (action) =>
          (result = action as TypedAction<
            '[Currency] Load Currency Rate Failure'
          >)
      );

      tick();

      expect(result).toEqual(expected);
    }));
  });

  describe('loadCurrencyRateFailure', () => {
    it('should trigger from loadCurrencyRateFailure', fakeAsync(() => {
      const errorMessage = 'Error Message';

      actions$ = of(loadCurrencyRateFailure({ errorMessage }));

      effects.loadCurrencyRateFailure$.subscribe();
      tick();

      expect(matSnackBarSpy.open).toHaveBeenCalledWith(
        `Error retrieving currency rate: ${errorMessage}`,
        'Dismiss',
        {
          verticalPosition: 'top',
          duration: 5000
        }
      );
    }));
  });
});
