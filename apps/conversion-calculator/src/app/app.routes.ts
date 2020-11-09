import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'currency',
    loadChildren: () =>
      import('@demo/currency-converter').then(
        (m) => m.CurrencyConverterFeatureModule
      )
  },
  {
    path: 'length',
    loadChildren: () =>
      import('@demo/length-converter').then(
        (m) => m.LengthConverterFeatureModule
      )
  },
  {
    path: '**',
    redirectTo: '/currency'
  }
];
