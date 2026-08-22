export interface HomepageServicePriceOption {
    optionKey:
      string | null;
  
    optionTitle:
      string | null;
  
    amount:
      number;
  
    currency:
      string;
  
    sortOrder:
      number;
  }
  
  
  export interface HomepageServicePriceSummary {
    serviceId:
      string;
  
    options:
      HomepageServicePriceOption[];
  }