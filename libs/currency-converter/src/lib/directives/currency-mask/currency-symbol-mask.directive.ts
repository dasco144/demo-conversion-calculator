import { getCurrencySymbol } from '@angular/common';
import {
  Directive,
  HostListener,
  Inject,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { NgControl } from '@angular/forms';
import {
  CURRENCY_PRECISION_TOKEN,
  maskRegex
} from '../../constants/currency-constants';
import {
  decimalCount,
  precisionHelper
} from '../../functions/precision-helpers';
import { CurrencyCodes } from '../../types/currency-codes';

@Directive({
  selector: '[formControlName][demoCurrencySymbolMask]'
})
export class CurrencySymbolMaskDirective implements OnChanges {
  // tslint:disable-next-line: no-input-rename
  @Input('demoCurrencySymbolMask') currencyCode: CurrencyCodes;

  private previousValue = '0';

  constructor(
    private ngControl: NgControl,
    @Inject(CURRENCY_PRECISION_TOKEN) private currencyPrecision: number
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.currencyCode && !changes.currencyCode.firstChange) {
      this.onValueChange(this.previousValue);
    }
  }

  @HostListener('ngModelChange', ['$event'])
  onModelChange(value: string): void {
    this.onValueChange(value);
  }

  private onValueChange(value: string): void {
    // Get the symbol for the unit
    const currencySymbol = getCurrencySymbol(this.currencyCode, 'narrow');

    if (!value) {
      this.ngControl.valueAccessor.writeValue(`${currencySymbol} 0`);
      return;
    }

    // Remove the alpha/symbol characters, round to 2 decimals and then update the value with the currency symbol
    let newVal = value.replace(maskRegex, '');

    // Keep the exact value if the decimal count is 0
    const decCount = decimalCount(newVal);

    // If not, round to the lower precision out of max precision and current precision
    if (decCount !== 0) {
      const precision = precisionHelper(newVal, this.currencyPrecision);
      const numVal = Number(newVal);
      newVal = numVal.toFixed(precision);
    }

    newVal = `${currencySymbol} ${newVal}`;

    this.ngControl.valueAccessor.writeValue(newVal);
    this.previousValue = newVal;
  }
}
