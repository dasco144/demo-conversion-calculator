import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { CurrencySymbolMaskModule } from '../../directives/currency-mask/currency-symbol-mask.module';
import { CurrencyStoreModule } from '../../store/currency-store.module';
import { CurrencyConverterComponent } from './currency-converter.component';

@NgModule({
  declarations: [CurrencyConverterComponent],
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatButtonModule,
    CurrencySymbolMaskModule,
    CurrencyStoreModule
  ],
  exports: [CurrencyConverterComponent],
  providers: []
})
export class CurrencyConverterModule {}
