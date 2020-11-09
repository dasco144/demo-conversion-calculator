import { NgModule } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CurrencyEffects } from './currency.effects';
import * as fromCurrency from './currency.reducer';

@NgModule({
  declarations: [],
  imports: [
    StoreModule.forFeature(
      fromCurrency.currencyFeatureKey,
      fromCurrency.reducer
    ),
    EffectsModule.forFeature([CurrencyEffects]),
    MatSnackBarModule
  ],
  exports: [],
  providers: []
})
export class CurrencyStoreModule {}
