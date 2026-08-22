export type GovernmentBondProduct =
  | "CETES"
  | "BONOS"
  | "BONDDIA";


export interface GovernmentBondRate {
  id: string;

  product:
    GovernmentBondProduct;

  term:
    string;

  rate:
    number;
}


export interface GovernmentBondRateSnapshot {
  sourceName:
    string;

  sourceDate:
    string | null;

  rates:
    GovernmentBondRate[];
}