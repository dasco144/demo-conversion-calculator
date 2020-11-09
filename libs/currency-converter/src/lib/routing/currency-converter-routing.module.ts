import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CurrencyConverterComponent } from '../components/currency-converter/currency-converter.component';
import { CurrencyConverterModule } from '../components/currency-converter/currency-converter.module';
import { RateHistoryComponent } from '../components/rate-history/rate-history.component';
import { RateHistoryModule } from '../components/rate-history/rate-history.module';

@NgModule({
  declarations: [],
  imports: [
    CurrencyConverterModule,
    RateHistoryModule,
    RouterModule.forChild([
      {
        path: '',
        component: CurrencyConverterComponent
      },
      {
        path: 'history',
        component: RateHistoryComponent
      }
    ])
  ],
  exports: [],
  providers: []
})
export class CurrencyConverterRoutingModule {}
