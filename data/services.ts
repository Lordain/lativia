export interface Service {
    id: string;
    slug: string;
    title: string;
    shortDescription: string;
    description: string;
    icon: string;
    category: string;
    popular: boolean;
    price?: string;
    duration?: string;
  }
  
  export const services: Service[] = [
    {
        id: "1",
        slug: "rfc",
        title: "RFC",
        shortDescription: "墨西哥稅號申請",
        description:
          "RFC 是墨西哥聯邦納稅人登記號，工作、報稅、銀行開戶都需要。",
        icon: "🧾",
        category: "Tax",
        popular: true,
        price: "MX$800",
        duration: "1~3 個工作天"
    },
    {
        id: "2",
        slug: "curp",
        title: "CURP",
        shortDescription: "墨西哥身份证号申請",
        description:
          "CURP是墨西哥身份证号，任何需要使用身份證的場合都需要。",
        icon: "🆔",
        category: "Identity",
        popular: true,
        price: "MX$400",
        duration: "1~3 個工作天"
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