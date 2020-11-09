import { getCurrencySymbol } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, shareReplay, takeUntil, tap } from 'rxjs/operators';
import {
  CURRENCY_PRECISION_TOKEN,
  maskRegex
} from '../../constants/currency-constants';
import {
  conversionUnitOp,
  conversionValueOp
} from '../../functions/custom-operators';
import { precisionHelper } from '../../functions/precision-helpers';
import { CurrencyRate } from '../../models/currency-rate';
import { CurrencyService } from '../../services/currency.service';
import { CurrencyCodes } from '../../types/currency-codes';
@Component({
  selector: 'demo-currency-converter',
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.scss']
})
export class CurrencyConverterComponent implements OnInit, OnDestroy {
  initialLoad = true;

  rate$: Observable<CurrencyRate>;

  loading$ = new BehaviorSubject<boolean>(false);

  destroy$ = new Subject<boolean>();

  currencyFormGroup: FormGroup;

  selectedCurrencyRate: CurrencyRate;

  constructor(
    private currencyService: CurrencyService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    @Inject(CURRENCY_PRECISION_TOKEN) private currencyPrecision: number
  ) {}

  ngOnInit(): void {
    this.initialise();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  navigateToHistory(): void {
    this.router.navigate(['history'], {
      relativeTo: this.activatedRoute,
      state: {
        baseCurrency: this.selectedCurrencyRate.base,
        compareRate: this.currencyFormGroup.get('to.currency').value
      }
    });
  }

  private initialise(): void {
    this.retrieveRate('ZAR');

    this.loading$.pipe(takeUntil(this.destroy$)).subscribe((loading) => {
      if (this.currencyFormGroup) {
        loading
          ? this.currencyFormGroup.disable({ emitEvent: false })
          : this.currencyFormGroup.enable({ emitEvent: false });
      }
    });
  }

  private retrieveRate(currencyCode: CurrencyCodes): void {
    this.loading$.next(true);

    this.currencyService.loadCurrencyRate(currencyCode);

    this.rate$ = this.currencyService.getCurrencyRate(currencyCode).pipe(
      filter((currencyRate) => !!currencyRate),
      tap((currencyRate) => (this.selectedCurrencyRate = currencyRate)),
      tap((currencyRate) =>
        !this.currencyFormGroup
          ? this.buildForm(currencyRate)
          : this.patchValues()
      ),
      // Delay to show loader more clearly
      // delay(500),
      tap(() => this.loading$.next(false)),
      tap(() => {
        this.initialLoad = false;
        this.cdRef.detectChanges();
      }),
      shareReplay(1)
    );
  }

  private buildForm(currencyRate: CurrencyRate): void {
    // Filter out base, and select first rate for the to currency field
    const toCurrency =
      (Object.keys(currencyRate.rates)
        .filter((key) => key !== currencyRate.base)
        .sort((a, b) => a.localeCompare(b))[0] as CurrencyCodes) ||
      currencyRate.base;

    const fromSymbol = getCurrencySymbol(currencyRate.base, 'narrow');
    const toSymbol = getCurrencySymbol(toCurrency, 'narrow');

    this.currencyFormGroup = new FormGroup({
      from: new FormGroup({
        currency: new FormControl(currencyRate.base),
        value: new FormControl(`${fromSymbol} 0`)
      }),
      to: new FormGroup({
        currency: new FormControl(toCurrency),
        value: new FormControl(`${toSymbol} 0`)
      })
    });

    this.setupValueChange();
  }

  private patchValues(): void {
    const formValue: string = this.currencyFormGroup.get('from.value').value;
    const numValue = Number(formValue.replace(maskRegex, ''));

    // Get the amount of precision to use
    const precision = precisionHelper(
      numValue.toString(),
      this.currencyPrecision
    );

    this.currencyFormGroup
      .get('from.value')
      .setValue(numValue.toFixed(precision), {
        emitEvent: false
      });

    // Calculate the exchange and update the target value form control
    this.calculateExchange(numValue, 'from');
  }

  private setupValueChange(): void {
    this.currencyFormGroup
      .get('from.currency')
      .valueChanges.pipe(
        conversionUnitOp<CurrencyCodes>((code) =>
          this.changeCurrency(code, 'from')
        ),
        takeUntil(this.destroy$)
      )
      .subscribe();

    this.currencyFormGroup
      .get('to.currency')
      .valueChanges.pipe(
        conversionUnitOp<CurrencyCodes>((code) =>
          this.changeCurrency(code, 'to')
        ),
        takeUntil(this.destroy$)
      )
      .subscribe();

    this.currencyFormGroup
      .get('from.value')
      .valueChanges.pipe(
        conversionValueOp((value: number) =>
          this.calculateExchange(value, 'from')
        ),
        takeUntil(this.destroy$)
      )
      .subscribe();

    this.currencyFormGroup
      .get('to.value')
      .valueChanges.pipe(
        conversionValueOp((value) => this.calculateExchange(value, 'to')),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private changeCurrency(
    currencyCode: CurrencyCodes,
    source: 'from' | 'to'
  ): void {
    if (source === 'from') {
      this.retrieveRate(currencyCode);
    } else {
      // Get the source value to update the form value with rounded value
      const formValue: string = this.currencyFormGroup.get(`${source}.value`)
        .value;
      const numValue = Number(formValue.replace(maskRegex, ''));

      // Get the amount of precision to use
      const precision = precisionHelper(
        numValue.toString(),
        this.currencyPrecision
      );

      this.currencyFormGroup
        .get(`${source}.value`)
        .setValue(numValue.toFixed(precision), {
          emitEvent: false
        });

      // Calculate the conversion and update the target value form control
      this.calculateExchange(numValue, source);
    }
  }

  private calculateExchange(input: number, source: 'from' | 'to'): void {
    const target = source === 'from' ? 'to' : 'from';

    // Cater for 0 value
    if (input === 0) {
      this.currencyFormGroup
        .get(`${target}.value`)
        .setValue('0', { emitEvent: false });
    }

    let targetCurrency: CurrencyCodes = this.currencyFormGroup.get(
      `${target}.currency`
    ).value;
    let targetValue: number;

    // If the unit is the currently selected unit then get the source unit and use that instead,
    // else, just get the rate using the target unit
    if (targetCurrency === this.selectedCurrencyRate.base) {
      targetCurrency = this.currencyFormGroup.get(`${source}.currency`).value;
      const rate = this.selectedCurrencyRate.rates[targetCurrency];
      targetValue = input / rate;
    } else {
      const rate = this.selectedCurrencyRate.rates[targetCurrency];
      targetValue = rate * input;
    }

    // Get the amount of precision to use
    const precision = precisionHelper(
      targetValue.toString(),
      this.currencyPrecision
    );

    this.currencyFormGroup
      .get(`${target}.value`)
      .setValue(targetValue.toFixed(precision), {
        emitEvent: false
      });
  }
}
