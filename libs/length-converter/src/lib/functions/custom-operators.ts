import { MonoTypeOperatorFunction, OperatorFunction } from 'rxjs';
import { debounceTime, map, tap } from 'rxjs/operators';
import { maskRegex } from '../constants/length-constants';

// Custom rxjs operators used to minimise duplication of piped operators
export function conversionUnitOp<T>(
  callback: (value: T) => void
): MonoTypeOperatorFunction<T> {
  return (input$) =>
    input$.pipe(
      debounceTime(100),
      tap((code) => callback(code))
    );
}

export function conversionValueOp(
  callback: (value: number) => void
): OperatorFunction<string, number> {
  return (input$) =>
    input$.pipe(
      debounceTime(100),
      map((value) => Number(value.replace(maskRegex, ''))),
      tap((number) => callback(number))
    );
}
