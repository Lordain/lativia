export interface Service {
    id: string;
    title: string;
    description: string;
    icon: string;
  }
  
  export const services: Service[] = [
    {
      id: "rfc",
      title: "RFC",
      description: "墨西哥稅號申請",
      icon: "🧾",
    },
    {
      id: "curp",
      title: "CURP",
      description: "墨西哥身份號",
      icon: "🆔",
    },
    {
      id: "sat",
      title: "SAT",
      description: "SAT 稅務服務",
      icon: "🏦",
    },
    {
      id: "bank",
      title: "銀行開戶",
      description: "協助辦理銀行帳戶",
      icon: "💳",
    },
    {
      id: "company",
      title: "公司註冊",
      description: "墨西哥公司成立",
      icon: "🏢",
    },
    {
      id: "visa",
      title: "簽證代辦",
      description: "簽證與居留申請",
      icon: "🛂",
    },
  ];