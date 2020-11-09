import { decimalCount, precisionHelper } from './precision-helpers';

describe('precisionHelper', () => {
  let lengthPrecision: number;

  beforeEach(() => {
    lengthPrecision = 5;
  });

  it('should return lower precision value (decimal lower)', () => {
    const value = '100.00';

    const precision = precisionHelper(value, lengthPrecision);

    expect(precision).toEqual(2);
  });

  it('should return lower precision value (max lower)', () => {
    const value = '100.000000';

    const precision = precisionHelper(value, lengthPrecision);

    expect(precision).toEqual(lengthPrecision);
  });

  it('should handle empty value', () => {
    const value = '';

    const precision = precisionHelper(value, lengthPrecision);

    expect(precision).toEqual(0);
  });

  it('should handle undefined value', () => {
    const value = undefined;

    const precision = precisionHelper(value, lengthPrecision);

    expect(precision).toEqual(0);
  });

  it('should handle undefined maxPrecision', () => {
    const value = undefined;

    const precision = precisionHelper(value, lengthPrecision);

    expect(precision).toEqual(0);
  });

  it('should handle null maxPrecision', () => {
    const value = null;

    const precision = precisionHelper(value, lengthPrecision);

    expect(precision).toEqual(0);
  });
});

describe('decimalCount', () => {
  it('should return count for decimal precision', () => {
    const value = '100.00';

    const decCount = decimalCount(value);

    expect(decCount).toEqual(2);
  });

  it('should handle value with out decimals', () => {
    const value = '100';

    const decCount = decimalCount(value);

    expect(decCount).toEqual(0);
  });

  it('should empty value', () => {
    const value = '';

    const decCount = decimalCount(value);

    expect(decCount).toEqual(0);
  });

  it('should undefined value', () => {
    const value = undefined;

    const decCount = decimalCount(value);

    expect(decCount).toEqual(0);
  });
});
