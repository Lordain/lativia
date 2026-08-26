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


export const COMPANY_RFC_ORDER_DOCUMENT_TYPES = [
  {
    value:
      "notarized_articles_of_incorporation",

    label:
      "公司章程公证文件",
  },

  {
    value:
      "shareholder_list",

    label:
      "股东清单（包括 RFC 和 CURP，境外股东可用境外税号）",
  },

  {
    value:
      "legal_representative_authorization",

    label:
      "法人代表授权书",
  },

  {
    value:
      "legal_representative_residence_card",

    label:
      "法人代表墨西哥居留卡",
  },

  {
    value:
      "company_registered_address",

    label:
      "公司注册地址证明",
  },
] as const;


export const COMPANY_EFIRMA_ORDER_DOCUMENT_TYPES = [
  ...COMPANY_RFC_ORDER_DOCUMENT_TYPES,

  {
    value:
      "legal_representative_rfc",

    label:
      "法人代表 RFC",
  },

  {
    value:
      "legal_representative_efirma",

    label:
      "法人代表 e.firma（电子签）",
  },
] as const;


/*
 * 保留兼容名称。
 *
 * Admin 的通用资料分类器仍可能需要显示
 * 所有企业资料类型。
 */
export const COMPANY_ORDER_DOCUMENT_TYPES =
  COMPANY_EFIRMA_ORDER_DOCUMENT_TYPES;


export const OTHER_ORDER_DOCUMENT_TYPE = {
  value:
    "other",

  label:
    "其他办理资料",
} as const;


export const ALL_ORDER_DOCUMENT_TYPES = [
  ...PERSONAL_ORDER_DOCUMENT_TYPES,
  ...COMPANY_EFIRMA_ORDER_DOCUMENT_TYPES,
  OTHER_ORDER_DOCUMENT_TYPE,
] as const;


/*
 * =========================================
 * Required documents by service
 * =========================================
 *
 * 注意：
 *
 * requirements
 * = 办理当天需要准备的完整资料。
 *
 * 这里
 * = 需要客户上传给平台提前检查的资料。
 *
 * 因此 e.firma 服务需要准备 U盘，
 * 但 U盘不是上传资料，不出现在这里。
 */
export function getRequiredOrderDocumentTypes(
  serviceSlug:
    string
) {
  switch (
    serviceSlug
  ) {
    case "company-rfc-first-registration":
      return COMPANY_RFC_ORDER_DOCUMENT_TYPES;

    case "company-efirma-first-registration":
    case "company-rfc-efirma-onsite":
      return COMPANY_EFIRMA_ORDER_DOCUMENT_TYPES;

    case "individual-rfc-first-registration":
    case "individual-efirma-first-registration":
    case "individual-rfc-efirma-onsite":
      return PERSONAL_ORDER_DOCUMENT_TYPES;

    default:
      return serviceSlug.startsWith(
        "company-"
      )
        ? COMPANY_ORDER_DOCUMENT_TYPES
        : PERSONAL_ORDER_DOCUMENT_TYPES;
  }
}


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
