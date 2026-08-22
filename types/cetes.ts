export type CetesInstrumentCode =
  | "CETES"
  | "BONOS"
  | "BONDDIA";


export interface CetesReferenceRate {
  id: string;

  instrumentCode:
    CetesInstrumentCode;

  termDays:
    number;

  rate:
    number;

  sourceDate:
    string;

  sourceName:
    string;

  sourceUrl:
    string | null;

  updatedAt:
    string | null;
}