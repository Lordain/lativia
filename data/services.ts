export interface Service {
    id: string;
    slug: string;
    title: string;
    shortDescription: string;
    description: string;
    icon: string;
    category: string;
    popular: boolean;
    price: string;
    duration: string;
    requirements?: string[];
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
        duration: "1~3 個工作天",
        requirements: ["护照", "居留卡", "CURP"]
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
        duration: "1~3 個工作天",
        requirements: ["护照", "居留卡"]
    },
  ];