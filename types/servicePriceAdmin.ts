export interface AdminServicePrice {
    id: string;
    serviceId: string;
  
    currency: string;
    amount: number;
  
    paymentMethod: string;
    paymentProvider: string | null;
  
    active: boolean;
  
    createdAt: string;
  }
  
  export interface ServicePriceFormData {
    currency: string;
  
    amount: string;
  
    paymentMethod: string;
  
    paymentProvider: string;
  
    active: boolean;
  }