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
  LENGTH_PRECISION_TOKEN,
  maskRegex
} from '../constants/length-constants';
import { lengthConversionUnits } from '../constants/length-conversion-units';
import { decimalCount, precisionHelper } from '../functions/precision-helpers';

@Directive({
  selector: '[formControlName][demoLengthSymbolMask]'
})
export class LengthSymbolMaskDirective implements OnChanges {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('demoLengthSymbolMask') unit: string;

  private previousValue = '0';

  constructor(
    private ngControl: NgControl,
    @Inject(LENGTH_PRECISION_TOKEN) private lengthPrecision: number
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.unit && !changes.unit.firstChange) {
      this.onValueChange(this.previousValue);
    }
  }

  @HostListener('ngModelChange', ['$event'])
  onModelChange(value: string): void {
    this.onValueChange(value);
  }

  private onValueChange(value: string): void {
    // Get the symbol for the unit
    const unitSymbol = lengthConversionUnits.find(
      (unit) => this.unit === unit.base
    ).symbol;

    if (!value) {
      this.ngControl.valueAccessor.writeValue(`0 ${unitSymbol}`);
      return;
    }

    // Remove the alpha/symbol characters, round to max 5 decimals and then update the value with the unit symbol
    let newVal = value.replace(maskRegex, '');

    // Keep the exact value if the decimal count is 0
    const decCount = decimalCount(newVal);

    // If not, round to the lower precision out of max precision and current precision
    if (decCount !== 0) {
      const precision = precisionHelper(newVal, this.lengthPrecision);
      const numVal = Number(newVal);
      newVal = numVal.toFixed(precision);
    }

    newVal = `${newVal} ${unitSymbol}`;

    this.ngControl.valueAccessor.writeValue(newVal);
  }
}
