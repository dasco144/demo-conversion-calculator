import { InjectionToken } from '@angular/core';

// Example for dependency injection via a manually created token
export const CURRENCY_PRECISION_TOKEN = new InjectionToken<number>(
  'CURRENCY_PRECISION_TOKEN'
);

export const currencyPrecisionAmount = 2;

export const maskRegex = /[^\d.]/g;
