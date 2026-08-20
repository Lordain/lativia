export const PERSONAL_ORDER_DOCUMENT_TYPES = [
    {
      value:
        "curp_document",
  
      label:
        "CURP",
    },
  
    {
      value:
        "passport",
  
      label:
        "护照",
    },
  
    {
      value:
        "residence_card",
  
      label:
        "墨西哥居留卡",
    },
  
    {
      value:
        "tax_address_proof",
  
      label:
        "税务地址证明",
    },
  ] as const;
  
  
  export const COMPANY_ORDER_DOCUMENT_TYPES = [
    {
      value:
        "notarized_articles_of_incorporation",
  
      label:
        "公证过的公司章程",
    },
  
    {
      value:
        "shareholder_list",
  
      label:
        "股东清单（每位股东需包含 RFC 和 CURP；境外股东提供境外税号）",
    },
  
    {
      value:
        "legal_representative_authorization",
  
      label:
        "法人代表授权书",
    },
  
    {
      value:
        "company_registered_address",
  
      label:
        "公司注册地址资料",
    },
  ] as const;
  
  
  export const OTHER_ORDER_DOCUMENT_TYPE = {
    value:
      "other",
  
    label:
      "其他办理资料",
  } as const;
  
  
  export const ALL_ORDER_DOCUMENT_TYPES = [
    ...PERSONAL_ORDER_DOCUMENT_TYPES,
    ...COMPANY_ORDER_DOCUMENT_TYPES,
    OTHER_ORDER_DOCUMENT_TYPE,
  ] as const;
  
  
  export function getOrderDocumentTypeLabel(
    value:
      string
  ) {
    const matched =
      ALL_ORDER_DOCUMENT_TYPES
        .find(
          item =>
            item.value ===
            value
        );
  
  
    if (
      matched
    ) {
      return matched.label;
    }
  
  
    switch (
      value
    ) {
      case "curp":
        return "CURP 资料";
  
      case "address_proof":
        return "地址证明";
  
      case "tax_document":
        return "税务资料";
  
      case "company_document":
        return "公司资料";
  
      default:
        return value;
    }
  }