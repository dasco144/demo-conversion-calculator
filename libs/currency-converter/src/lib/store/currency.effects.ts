import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import {
  catchError,
  concatMap,
  filter,
  first,
  map,
  mergeMap,
  tap
} from 'rxjs/operators';
import { CurrencyRate } from '../models/currency-rate';
import * as CurrencyActions from './currency.actions';
import { selectCurrencyRate } from './currency.selectors';

@Injectable()
export class CurrencyEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private httpService: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  readonly basePath = 'https://api.exchangerate.host/latest';
  readonly defaultBase = 'ZAR';

  loadCurrencyRate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrencyActions.loadCurrencyRate),
      mergeMap(({ currencyCode }) =>
        this.store.select(selectCurrencyRate, { currencyCode }).pipe(
          first(),
          map((result) => ({ currencyCode, result }))
        )
      ),
      // If result is already in the store then don't hit the api again
      filter(({ result }) => !result),
      map(({ currencyCode }) => currencyCode),
      concatMap((currencyCode) =>
        this.httpService
          .get<CurrencyRate>(
            `${this.basePath}?base=${currencyCode || this.defaultBase}`
          )
          .pipe(
            concatMap((currencyRate) => [
              CurrencyActions.loadCurrencyRateSuccess({ currencyRate }),
              CurrencyActions.setSelectedCurrency({
                currencyCode: currencyRate.base
              })
            ]),
            catchError((error) =>
              of(
                CurrencyActions.loadCurrencyRateFailure({
                  errorMessage: error.message
                })
              )
            )
          )
      )
    )
  );

  loadCurrencyRateFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CurrencyActions.loadCurrencyRateFailure),
        tap(({ errorMessage }) => {
          this.snackBar.open(
            `Error retrieving currency rate: ${errorMessage}`,
            'Dismiss',
            {
              verticalPosition: 'top',
              duration: 5000
            }
          );
        })
      ),
    { dispatch: false }
  );
}
