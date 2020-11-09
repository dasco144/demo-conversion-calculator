export interface LengthUnit {
  base: string;
  symbol: string;
  rates: {
    [key: string]: number;
  };
}
