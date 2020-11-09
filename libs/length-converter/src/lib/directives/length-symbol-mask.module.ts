import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  lengthPrecisionAmount,
  LENGTH_PRECISION_TOKEN
} from '../constants/length-constants';
import { LengthSymbolMaskDirective } from './length-symbol-mask.directive';

@NgModule({
  declarations: [LengthSymbolMaskDirective],
  imports: [CommonModule],
  exports: [LengthSymbolMaskDirective],
  providers: [
    { provide: LENGTH_PRECISION_TOKEN, useValue: lengthPrecisionAmount }
  ]
})
export class LengthSymbolMaskModule {}
