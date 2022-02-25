export interface ISecurity {
  symbol: string;
  currency: string;
  name: string;
  type: string;
}
export interface IHolding {
  security: ISecurity;
  quantity: number;
  book_value: number;
  market_value: number;
}
