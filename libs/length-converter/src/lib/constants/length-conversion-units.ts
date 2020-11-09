import { LengthUnit } from '../models/length-unit';

export const lengthConversionUnits: LengthUnit[] = [
  {
    base: 'meter',
    symbol: 'm',
    rates: {
      meter: 1,
      kilometer: 0.001,
      centimeter: 100,
      millimeter: 1000,
      mile: 1609.344,
      yard: 1.09361,
      foot: 3.28084,
      inch: 39.3701
    }
  },
  {
    base: 'kilometer',
    symbol: 'km',
    rates: {
      meter: 1000,
      kilometer: 1,
      centimeter: 100000,
      millimeter: 1000000,
      mile: 1.609344,
      yard: 1093.61,
      foot: 3280.84,
      inch: 39370.1
    }
  },
  {
    base: 'centimeter',
    symbol: 'cm',
    rates: {
      meter: 0.01,
      kilometer: 0.00001,
      centimeter: 1,
      millimeter: 10,
      mile: 160934.4,
      yard: 0.010936,
      foot: 0.032808,
      inch: 0.393701
    }
  },
  {
    base: 'millimeter',
    symbol: 'mm',
    rates: {
      meter: 0.001,
      kilometer: 0.000001,
      centimeter: 0.1,
      millimeter: 1,
      mile: 1609344,
      yard: 0.001093,
      foot: 0.00328,
      inch: 0.03937
    }
  },
  {
    base: 'mile',
    symbol: 'mi',
    rates: {
      meter: 1609.34,
      kilometer: 1.6093,
      centimeter: 160934,
      millimeter: 1609344,
      mile: 1,
      yard: 1760,
      foot: 5280,
      inch: 63360
    }
  },
  {
    base: 'yard',
    symbol: 'yd',
    rates: {
      meter: 0.000914,
      kilometer: 0.9144,
      centimeter: 91.44,
      millimeter: 914.4,
      mile: 0.000568,
      yard: 1,
      foot: 3,
      inch: 36
    }
  },
  {
    base: 'foot',
    symbol: 'ft',
    rates: {
      meter: 0.3048,
      kilometer: 0.0003048,
      centimeter: 30.48,
      millimeter: 304.8,
      mile: 0.018939,
      yard: 0.333333,
      foot: 1,
      inch: 12
    }
  },
  {
    base: 'inch',
    symbol: 'in',
    rates: {
      meter: 0.0254,
      kilometer: 0.000025,
      centimeter: 2.54,
      millimeter: 25.4,
      mile: 0.000015,
      yard: 0.027777,
      foot: 0.083333,
      inch: 1
    }
  }
];
