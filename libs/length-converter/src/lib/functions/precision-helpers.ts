export function precisionHelper(value: string, maxPrecision: number): number {
  if (!value || maxPrecision === undefined || maxPrecision === null) {
    return 0;
  }

  const decCount = decimalCount(value);

  const precision = decCount < maxPrecision ? decCount : maxPrecision;
  return precision;
}

export function decimalCount(value: string): number {
  if (!value || value.indexOf('.') === -1) {
    return 0;
  }

  const decCount = value.split('.')[1].length;

  return decCount;
}
