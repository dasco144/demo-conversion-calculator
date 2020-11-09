import { fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { maskRegex } from '../constants/length-constants';
import { conversionUnitOp, conversionValueOp } from './custom-operators';

describe('conversionUnitOp', () => {
  it('should execute callback with unit value', fakeAsync(() => {
    const unit = 'Unit';

    let result: string;
    const obs = of(unit).pipe(conversionUnitOp((res) => (result = res)));
    obs.subscribe();
    tick(105);

    expect(result).toEqual(unit);
  }));
});

describe('conversionValueOp', () => {
  it('should execute callback with parsed number value', fakeAsync(() => {
    const value = '$ 123';

    let result: number;
    const obs = of(value).pipe(conversionValueOp((res) => (result = res)));
    obs.subscribe();
    tick(105);

    expect(result).toEqual(Number(value.replace(maskRegex, '')));
  }));
});
