export interface CetesReferenceRate {
    id: string;
  
    termDays:
      28 |
      91 |
      182 |
      364;
  
    rate: number;
  
    sourceDate:
      string;
  
    sourceName:
      string;
  
    sourceUrl:
      string | null;
  
    updatedAt:
      string | null;
  }