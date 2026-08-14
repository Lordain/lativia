export interface SendEmailInput {
    to: string;
  
    subject: string;
  
    html: string;
  
    text?: string;
  
    replyTo?:
      string | null;
  }
  
  
  export interface SendEmailResult {
    provider:
      "resend";
  
    providerMessageId:
      string;
  }