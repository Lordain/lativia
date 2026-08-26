export interface GuideSection {
    heading:
      string;
  
    paragraphs?:
      string[];
  
    items?:
      string[];
  }
  
  
  export interface Guide {
    slug:
      string;
  
    title:
      string;
  
    description:
      string;
  
    category:
      string;
  
    updatedAt:
      string;
  
    relatedServiceSlug?:
      string;
  
    relatedServiceLabel?:
      string;
  
    sections:
      GuideSection[];
  }
  
  
  export const guides:
    Guide[] = [
    {
      slug:
        "mexico-rfc-for-chinese",
  
      title:
        "中国人在墨西哥如何首次申请 RFC？",
  
      description:
        "整理外国人在墨西哥首次申请 RFC 的适用对象、常见资料、SAT 预约与现场办理流程。",
  
      category:
        "SAT / RFC",
  
      updatedAt:
        "2026-08-26",
  
      relatedServiceSlug:
        "individual-rfc-first-registration",
  
      relatedServiceLabel:
        "查看个人 RFC 首次申请协助",
  
      sections: [
        {
          heading:
            "RFC 是什么？",
  
          paragraphs: [
            "RFC（Registro Federal de Contribuyentes）是墨西哥联邦纳税人登记号码。对于在墨西哥工作、经营、开公司、处理部分银行或税务事项的外国人来说，RFC 是非常常见的基础税务身份信息。",
            "是否需要承担具体税务义务，要根据个人实际活动和税务身份判断；取得 RFC 本身并不等于所有人都适用相同税制。",
          ],
        },
  
        {
          heading:
            "中国人可以申请 RFC 吗？",
  
          paragraphs: [
            "可以。SAT 对外国个人有专门的 RFC 登记流程。外国申请人通常需要以本人身份或符合规定的代表方式办理，并根据具体身份准备移民、身份证明及地址资料。",
          ],
        },
  
        {
          heading:
            "常见需要准备的资料",
  
          items: [
            "CURP（如已取得）",
            "有效护照",
            "有效墨西哥居留或移民文件",
            "符合 SAT 要求的税务地址证明",
          ],
  
          paragraphs: [
            "不同身份和办理情形可能需要补充材料，实际以 SAT 当日审核要求为准。",
          ],
        },
  
        {
          heading:
            "办理流程",
  
          items: [
            "确认个人身份及 RFC 申请类型",
            "准备办理资料",
            "预约 SAT",
            "按预约时间前往 SAT 办公室",
            "提交资料并完成身份及税务信息确认",
            "办理成功后取得 RFC 相关登记结果",
          ],
        },
  
        {
          heading:
            "资料不完整会怎样？",
  
          paragraphs: [
            "SAT 官方说明，如果现场提交的材料不完整或不符合要求，可能会收到未完成办理的回执，并需要在规定时间内补齐，否则可能需要重新启动申请流程。",
          ],
        },
  
        {
          heading:
            "RFC 办好以后还需要 e.firma 吗？",
  
          paragraphs: [
            "不一定每个人都必须马上申请 e.firma，但很多后续税务、公司及线上手续会使用 e.firma。RFC 和 e.firma 是两个不同概念：RFC 是税务登记身份，e.firma 是由 SAT 签发的高级电子签名。",
          ],
        },
      ],
    },
  
    {
      slug:
        "mexico-efirma-for-chinese",
  
      title:
        "墨西哥 e.firma 是什么？中国人怎么办理？",
  
      description:
        "说明墨西哥 SAT e.firma 的作用、与 RFC 的区别、外国申请人常见准备资料及现场办理方式。",
  
      category:
        "SAT / e.firma",
  
      updatedAt:
        "2026-08-26",
  
      relatedServiceSlug:
        "individual-efirma-first-registration",
  
      relatedServiceLabel:
        "查看个人 e.firma 首次申请协助",
  
      sections: [
        {
          heading:
            "e.firma 是什么？",
  
          paragraphs: [
            "e.firma 是墨西哥 SAT 的高级电子签名体系。它可以用于多种税务、公司和政府线上手续，法律和技术作用不同于普通网站密码。",
          ],
        },
  
        {
          heading:
            "RFC 和 e.firma 有什么区别？",
  
          items: [
            "RFC：墨西哥税务登记号码",
            "e.firma：用于验证身份并签署电子手续的数字签名",
          ],
  
          paragraphs: [
            "通常应先完成 RFC 登记，再根据需要申请 e.firma。",
          ],
        },
  
        {
          heading:
            "个人首次申请通常需要准备什么？",
  
          items: [
            "RFC",
            "有效身份证明",
            "外国申请人的有效墨西哥居留或移民文件",
            "符合 SAT 要求的地址证明",
            "U盘",
            "可正常使用的电子邮箱",
          ],
        },
  
        {
          heading:
            "为什么需要本人到 SAT？",
  
          paragraphs: [
            "首次申请 e.firma 属于身份确认程度较高的手续。SAT 会在现场核验申请人身份，并采集相应身份信息，因此不能单纯通过提供账号密码让第三方远程代替完成。",
          ],
        },
  
        {
          heading:
            "U盘是做什么的？",
  
          paragraphs: [
            "SAT 要求首次办理时准备可移动存储设备，通常建议使用新的或空白 U盘，用于接收办理过程中产生的相关数字文件。",
          ],
        },
  
        {
          heading:
            "需要注意什么？",
  
          paragraphs: [
            "e.firma 的私钥、密码和其他认证信息应由本人保管。办理协助服务不应要求客户把 e.firma 私钥密码交给服务人员。",
          ],
        },
      ],
    },
  
    {
      slug:
        "how-to-book-sat-appointment",
  
      title:
        "外国人在墨西哥如何预约 SAT？",
  
      description:
        "介绍外国人在墨西哥办理 RFC、e.firma 等 SAT 手续时常见的预约流程、资料准备和到场注意事项。",
  
      category:
        "SAT",
  
      updatedAt:
        "2026-08-26",
  
      relatedServiceSlug:
        "individual-rfc-first-registration",
  
      relatedServiceLabel:
        "查看 SAT / RFC 预约协助",
  
      sections: [
        {
          heading:
            "哪些手续通常需要 SAT 预约？",
  
          paragraphs: [
            "RFC 首次登记、e.firma 首次申请等手续，经常需要提前取得 SAT 预约。具体是否必须预约，要以对应手续的 SAT 官方页面为准。",
          ],
        },
  
        {
          heading:
            "预约前先确认办理类型",
  
          paragraphs: [
            "SAT 的不同预约项目对应不同业务。选择错误项目，即使取得预约，也可能无法在现场完成想办理的手续。",
          ],
        },
  
        {
          heading:
            "预约前建议准备",
  
          items: [
            "确认要办理 RFC、e.firma 或其他具体业务",
            "确认本人基本税务及身份信息",
            "准备常用电子邮箱",
            "提前查看对应业务的材料要求",
          ],
        },
  
        {
          heading:
            "取得预约后",
  
          items: [
            "确认预约日期、时间与 SAT 办公室",
            "按对应业务准备原件及必要材料",
            "提前到达办理地点",
            "不要只根据他人的旧资料清单准备文件",
          ],
        },
  
        {
          heading:
            "为什么资料检查很重要？",
  
          paragraphs: [
            "预约本身并不代表一定能完成业务。如果资料缺失、身份信息不一致或预约项目选择错误，现场仍可能无法完成办理。",
          ],
        },
      ],
    },
  
    {
      slug:
        "can-chinese-buy-mexico-cetes",
  
      title:
        "中国人可以买墨西哥 CETES 吗？",
  
      description:
        "从 Cetesdirecto 开户、身份条件、资金操作和主要风险角度说明中国用户接触墨西哥 CETES 时需要了解的基本事项。",
  
      category:
        "CETES / Cetesdirecto",
  
      updatedAt:
        "2026-08-26",
  
      relatedServiceSlug:
        "cetesdirecto-consultation",
  
      relatedServiceLabel:
        "查看 Cetesdirecto 中文咨询",
  
      sections: [
        {
          heading:
            "CETES 是什么？",
  
          paragraphs: [
            "CETES 是墨西哥联邦政府发行的短期政府证券之一。投资者通常以折价方式买入，到期按面值兑付，收益来自买入价格与到期价值之间的差额。",
          ],
        },
  
        {
          heading:
            "中国人是否可以买？",
  
          paragraphs: [
            "重点不在国籍本身，而在是否满足 Cetesdirecto 当前的开户与身份验证条件。实际可开户范围、身份文件和银行账户要求，应以 Cetesdirecto 当前规则为准。",
          ],
        },
  
        {
          heading:
            "通常会涉及哪些步骤？",
  
          items: [
            "确认开户资格",
            "创建 Cetesdirecto 账户",
            "完成身份和账户验证",
            "绑定符合要求的银行账户",
            "入金",
            "自行选择是否购买 CETES 或其他产品",
            "到期或按平台规则处理资金",
          ],
        },
  
        {
          heading:
            "咨询服务和投资建议有什么区别？",
  
          paragraphs: [
            "开户、入金、出金以及平台操作说明属于流程协助；是否投资、买什么产品、投入多少资金以及何时交易属于用户自己的投资决定。",
          ],
        },
  
        {
          heading:
            "除了汇率还有什么风险？",
  
          items: [
            "市场利率变化",
            "提前卖出时的价格波动",
            "流动性和操作时间限制",
            "平台或银行操作错误",
            "税务处理变化",
            "个人账户与认证资料管理风险",
          ],
        },
  
        {
          heading:
            "特别提醒",
  
          paragraphs: [
            "CETES 属于投资产品，不是人民币定存。中国用户还需要额外考虑 MXN 与人民币之间的汇率变化。",
          ],
        },
      ],
    },
  
    {
      slug:
        "cetes-bonos-bonddia-differences",
  
      title:
        "CETES、BONOS、BONDDIA 有什么区别？",
  
      description:
        "用中文比较 CETES、BONOS 和 BONDDIA 的产品性质、期限、收益方式与流动性，帮助中国用户理解 Cetesdirecto 常见产品。",
  
      category:
        "CETES / Cetesdirecto",
  
      updatedAt:
        "2026-08-26",
  
      relatedServiceSlug:
        "cetesdirecto-consultation",
  
      relatedServiceLabel:
        "查看 Cetesdirecto 中文咨询",
  
      sections: [
        {
          heading:
            "先看最简单的区别",
  
          items: [
            "CETES：短期政府证券，通常以折价买入，到期按面值兑付",
            "BONOS：期限通常更长的政府债券，通常会涉及固定票息和市场价格",
            "BONDDIA：每日流动的债务投资基金，可理解为账户里的活期投资账户，但不是银行活期存款",
          ],
        },
  
        {
          heading:
            "CETES 适合怎么理解？",
  
          paragraphs: [
            "CETES 没有传统意义上的定期票息。投资者以低于到期面值的价格买入，持有到期后取得面值，差额构成收益。",
          ],
        },
  
        {
          heading:
            "BONOS 和 CETES 最大差别",
  
          paragraphs: [
            "BONOS 通常期限更长，而且价格会受到市场利率变化影响。如果在到期前卖出，实际成交价格可能高于或低于原来的买入价格。",
          ],
        },
  
        {
          heading:
            "BONDDIA 为什么可以理解成活期投资账户？",
  
          paragraphs: [
            "从用户操作体验看，BONDDIA 常用于账户内短期资金停放、等待后续购买或提款，因此对中国用户可以辅助理解为“活期投资账户”。",
            "但 BONDDIA 本质是债务投资基金，不是银行存款，因此不能把它等同于银行活期账户或保证本金的存款产品。",
          ],
        },
  
        {
          heading:
            "三种产品怎么比较？",
  
          items: [
            "看期限",
            "看收益产生方式",
            "看是否需要等到期",
            "看提前退出时是否存在市场价格变化",
            "看资金流动性需求",
          ],
        },
  
        {
          heading:
            "不要只看收益率",
  
          paragraphs: [
            "对以人民币计算资产的中国用户来说，即使墨西哥比索投资本身产生收益，MXN/CNY 汇率变化仍可能明显影响最终以人民币衡量的结果。",
          ],
        },
      ],
    },
  ];
  
  
  export function getGuide(
    slug:
      string
  ) {
    return guides.find(
      guide =>
        guide.slug ===
        slug
    );
  }