export interface PaymentVerificationResult {
    success: boolean;
  
    canRepair: boolean;
  
    message: string;
  
    stripePaymentStatus?: string;
  
    stripeAmount?: number;
  
    stripeCurrency?: string;
  
    orderAmount?: number;
  
    orderCurrency?: string;
  }