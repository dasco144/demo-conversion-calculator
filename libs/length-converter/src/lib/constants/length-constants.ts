import { InjectionToken } from '@angular/core';

// Example for dependency injection via a manually created token
export const LENGTH_PRECISION_TOKEN = new InjectionToken<number>(
  'LENGTH_PRECISION_TOKEN'
);

export const lengthPrecisionAmount = 5;

export const maskRegex = /[^\d.]/g;
