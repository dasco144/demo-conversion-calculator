import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  currencyPrecisionAmount,
  CURRENCY_PRECISION_TOKEN
} from '../../constants/currency-constants';
import { CurrencySymbolMaskDirective } from './currency-symbol-mask.directive';

@NgModule({
  declarations: [CurrencySymbolMaskDirective],
  imports: [CommonModule],
  exports: [CurrencySymbolMaskDirective],
  providers: [
    { provide: CURRENCY_PRECISION_TOKEN, useValue: currencyPrecisionAmount }
  ]
})
export class CurrencySymbolMaskModule {}
