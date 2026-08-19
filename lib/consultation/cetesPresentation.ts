export type CetesPresentationSection =
  | "intro"
  | "products"
  | "account"
  | "tax"
  | "requirements"
  | "auction"
  | "process"
  | "risk"
  | "practice";


export type CetesPresentationLayout =
  | "hero"
  | "boundary"
  | "comparison"
  | "levels"
  | "tax"
  | "requirements"
  | "auction"
  | "process"
  | "risk"
  | "screenshots"
  | "placeholder"
  | "status";


export type PresentationIcon =
  | "book"
  | "user"
  | "key"
  | "auction"
  | "deposit"
  | "withdraw"
  | "shield"
  | "bank"
  | "document"
  | "location"
  | "tax"
  | "warning"
  | "chart"
  | "check"
  | "clock"
  | "lock";


export interface PresentationCard {
  icon: PresentationIcon;

  title: string;

  description: string;

  emphasis?: boolean;
}

export interface PresentationStatusItem {
  icon: PresentationIcon;

  title: string;

  description: string;
}


export interface ComparisonRow {
  product: string;

  type: string;

  yieldExample: string;

  purchase: string;

  purpose: string;
}


export interface LevelRow {
  level: string;

  verification: string;

  fundingLimit: string;

  mxnExample: string;

  useCase: string;
}


export interface PresentationStep {
  icon: PresentationIcon;

  title: string;

  description: string;
}


export interface RiskItem {
  icon: PresentationIcon;

  title: string;

  description: string;
}


export interface PresentationScreenshot {
  src: string;

  label: string;

  title: string;

  description: string;

  highlights?: string[];
}


export interface CetesPresentationSlide {
  id: string;

  section: CetesPresentationSection;

  number: number;

  eyebrow: string;

  title: string;

  shortTitle: string;

  layout: CetesPresentationLayout;

  statusItems?: PresentationStatusItem[];

  placeholderTitle?: string;

  placeholderDescription?: string;

  summary: string;

  source?: string | null;

  cards?: PresentationCard[];

  comparisonRows?: ComparisonRow[];

  levelRows?: LevelRow[];

  formula?: {
    title: string;

    expression: string;

    example: string;

    footnote: string;
  };

  steps?: PresentationStep[];

  knowBefore?: string[];

  risks?: RiskItem[];

  screenshots?: PresentationScreenshot[];

  screenshotPoints?: PresentationCard[];
}


export const cetesPresentationSlides: CetesPresentationSlide[] = [
  /*
   * =========================================
   * 01
   * Service Overview
   * =========================================
   */

  {
    id: "consultation-overview",

    section: "intro",

    number: 1,

    eyebrow: "CONSULTATION",

    title: "墨西哥国债开户与操作咨询",

    shortTitle: "课程总览",

    layout: "hero",

    summary:
      "用简单中文先把墨西哥国债、Cetesdirecto 和资金操作讲清楚，再进入实际开户测试。账户、资金和投资决定始终由您本人管理。",

    source: null,

    cards: [
      {
        icon: "book",

        title:
          "01  国债产品理解",

        description:
          "快速理解 CETES、BONOS、BONDDIA 的差别、收益方式和主要用途。",
      },

      {
        icon: "user",

        title:
          "02  Cetesdirecto 开户",

        description:
          "确认开户条件，理解注册步骤，并开始实际开户测试。",

        emphasis:
          true,
      },

      {
        icon: "key",

        title:
          "03  账户等级与 e.firma",

        description:
          "理解 Nivel 2、Nivel 4、UDIS，以及为什么部分用户需要 e.firma 升级。",

        emphasis:
          true,
      },

      {
        icon: "auction",

        title:
          "04  国债购买与 Subasta",

        description:
          "理解国债购买指令、Subasta（拍卖）和实际持仓出现的时间差。",
      },

      {
        icon: "deposit",

        title:
          "05  首次入金",

        description:
          "指导您理解本人银行账户、CLABE 与 Cetesdirecto 的资金转入关系。",

        emphasis:
          true,
      },

      {
        icon: "withdraw",

        title:
          "06  首次出金测试",

        description:
          "完成首次资金转回本人银行账户的测试，确认掌握基本资金进出流程。",

        emphasis:
          true,
      },
    ],
  },


  /*
   * =========================================
   * 02
   * Boundary & Security
   * =========================================
   */

  {
    id: "security-boundary",

    section: "intro",

    number: 2,

    eyebrow: "SECURITY",

    title: "先把账户安全边界讲清楚",

    shortTitle: "服务边界",

    layout: "boundary",

    summary:
      "咨询过程中，我们可以解释画面、步骤和规则，但账户登录、安全验证和资金操作始终由您本人完成。",

    source:
      "参考：Cetesdirecto 官方登录及密码恢复说明",

    cards: [
      {
        icon: "user",

        title:
          "Usuario（用户名）和密码",

        description:
          "由您本人输入和保管。我们不会记录、保存或要求您发送登录密码。",
      },

      {
        icon: "lock",

        title:
          "OTP（一次性动态验证码）",

        description:
          "包括短信验证码、App 动态码或其他一次性验证码，只能由您本人查看和输入。",
      },

      {
        icon: "key",

        title:
          "e.firma",

        description:
          ".cer、.key 和私钥密码由您本人保管。咨询人员不会收取或代替您输入私钥密码。",
      },

      {
        icon: "bank",

        title:
          "银行与资金",

        description:
          "所有银行转账、入金、出金及金额选择均由您本人确认和执行。",
      },

      {
        icon: "chart",

        title:
          "投资决定",

        description:
          "我们解释产品和操作方式，但不替您决定买什么、买多少或什么时候买。",
      },

      {
        icon: "shield",

        title:
          "屏幕共享",

        description:
          "遇到密码、验证码或其他敏感资料时，可以暂停共享或自行输入，不需要展示给咨询人员。",
      },
    ],
  },


  /*
   * =========================================
   * 03
   * Product Comparison
   * =========================================
   */

  {
    id: "products-comparison",

    section: "products",

    number: 3,

    eyebrow: "PRODUCTS",

    title: "CETES、BONOS、BONDDIA 一页看懂",

    shortTitle: "产品对比",

    layout: "comparison",

    summary:
      "这三个名称经常一起出现，但它们不是同一种产品。先看最重要的差别，再决定后面需要了解哪一种操作。",

    source:
      "收益示例：Cetesdirecto 官方数据，2026-08-08；仅作差异说明，不代表未来收益。",

    comparisonRows: [
      {
        product:
          "CETES",

        type:
          "墨西哥短期国债",

        yieldExample:
          "1 年约 6.93%",

        purchase:
          "提交购买指令，跟随国债 Subasta（拍卖）安排",

        purpose:
          "较短期限的国债配置",
      },

      {
        product:
          "BONOS",

        type:
          "墨西哥中长期固定利率国债",

        yieldExample:
          "10 年约 9.02%",

        purchase:
          "按可用期限购买，并理解票息及价格波动",

        purpose:
          "中长期国债持有",
      },

      {
        product:
          "BONDDIA",

        type:
          "每日流动的债务投资基金，不是单一国债",

        yieldExample:
          "1 日指标约 6.34%",

        purchase:
          "无需购买；入金后资金可直接进入 BONDDIA",

        purpose:
          "流动资金、等待后续购买或提款",
      },
    ],
  },


  /*
   * =========================================
   * 04
   * Account Levels
   * =========================================
   */

  {
    id: "account-levels",

    section: "account",

    number: 4,

    eyebrow: "ACCOUNT LEVEL",

    title: "什么是用户等级？为什么要绑定 e.firma？",

    shortTitle: "等级与 e.firma",

    layout: "levels",

    summary:
      "开户后通常先得到 Nivel 2 / Contrato Exprés。账户等级主要影响每月能够转入 Cetesdirecto 的资金规模。",

    source:
      "参考：Cetesdirecto 官方 FAQ；UDI 示例采用 Banco de México 2026-08-10 数据。",

    levelRows: [
      {
        level:
          "Nivel 2 / Contrato Exprés",

        verification:
          "基础线上开户",

        fundingLimit:
          "每月累计最多 3,000 UDIS",

        mxnExample:
          "3,000 × 8.797743 ≈ MXN 26,393",

        useCase:
          "适合先完成开户和基础操作",
      },

      {
        level:
          "Nivel 4",

        verification:
          "提高身份验证强度，可通过 e.firma 等方式升级",

        fundingLimit:
          "取消每月 3,000 UDIS 入金上限",

        mxnExample:
          "投资能力最高可提高至 MXN 10,000,000",

        useCase:
          "计划投入更高资金规模",
      },
    ],

    cards: [
      {
        icon: "document",

        title:
          "UDIS 是什么？",

        description:
          "UDIS（Unidades de Inversión，投资单位）不是一种货币。它每天都有对应的墨西哥比索价值。",
      },

      {
        icon: "key",

        title:
          "e.firma 的作用",

        description:
          "e.firma（墨西哥税务电子签）可以用于提高账户验证等级和资金操作能力。",
      },

      {
        icon: "shield",

        title:
          "升级时的安全原则",

        description:
          ".cer、.key 和私钥密码始终由客户本人操作和保管。",
      },
    ],
  },


  /*
   * =========================================
   * 05
   * Tax
   * =========================================
   */

  {
    id: "tax-withholding",

    section: "tax",

    number: 5,

    eyebrow: "TAX",

    title: "国债收益的 ISR 自动预扣怎么理解？",

    shortTitle: "自动扣税",

    layout: "tax",

    summary:
      "Cetesdirecto 会记录利息和已经预扣的 ISR（Impuesto Sobre la Renta，所得税），并向 SAT 反映相关资料。预扣不是最终年度税额。",

    source:
      "官方依据：2026 Ley de Ingresos de la Federación Art. 24；SAT RMF Regla 3.5.4；Cetesdirecto FAQ。",

    formula: {
      title:
        "2026 年简化预扣示意",

      expression:
        "预扣 ISR ≈ 投资本金 × 0.90% × 持有天数 ÷ 365",

      example:
        "例：MXN 100,000 × 0.90% × 90 ÷ 365 ≈ MXN 222",

      footnote:
        "0.90% 是 2026 年法定年度预扣率，并按持有天数比例计算。这是预扣 / provisional payment（预缴），不等于最终年度应缴 ISR。",
    },

    cards: [
      {
        icon: "tax",

        title:
          "平台会记录预扣",

        description:
          "Cetesdirecto 官方说明，会向税务机关反映已支付利息及已进行的 ISR 预扣。",
      },

      {
        icon: "document",

        title:
          "年度申报会看到相关资料",

        description:
          "官方说明这些资料会出现在 SAT 建议的年度申报资料中。",
      },

      {
        icon: "warning",

        title:
          "预扣 ≠ 最终税负",

        description:
          "实际年度税务结果仍与个人税务情况和当年规则有关。",
      },
    ],
  },


  /*
   * =========================================
   * 06
   * Requirements
   * =========================================
   */

  {
    id: "official-requirements",

    section: "requirements",

    number: 6,

    eyebrow: "REQUIREMENTS",

    title: "开户前，先确认这些条件",

    shortTitle: "开户条件",

    layout: "requirements",

    summary:
      "正式开始注册前先检查基础条件，可以减少开户过程中卡住或反复重来的情况。",

    source:
      "参考：Cetesdirecto 官方开户 FAQ 与地理位置说明。",

    cards: [
      {
        icon: "user",

        title:
          "18 岁以上",

        description:
          "官方基本开户条件要求申请人年满 18 岁。",
      },

      {
        icon: "location",

        title:
          "外国人需要在墨西哥有合法居留",

        description:
          "官方 FAQ 要求外国申请人具有在墨西哥的固定居留，并能证明合法居留身份。",
      },

      {
        icon: "document",

        title:
          "RFC + CURP",

        description:
          "开户前准备好 RFC（墨西哥税号）及 CURP（墨西哥人口登记号码）。",
      },

      {
        icon: "bank",

        title:
          "本人名下墨西哥银行账户",

        description:
          "需要本人作为持有人的墨西哥银行账户，以及对应银行卡或 CLABE。",
      },

      {
        icon: "location",

        title:
          "本人在墨西哥境内完成",

        description:
          "本咨询服务按本人在墨西哥境内完成开户作为实操条件；Cetesdirecto 数字渠道同时要求开启设备地理定位。",
      },

      {
        icon: "key",

        title:
          "计划升级时准备 e.firma",

        description:
          "基础 Contrato Exprés 不要求 e.firma；如果计划提高资金操作规模，应确认自己的 e.firma 可以正常使用。",
      },
    ],
  },


  /*
   * =========================================
   * 07
   * Auction
   * =========================================
   */

  {
    id: "government-auction",

    section: "auction",

    number: 7,

    eyebrow: "SUBASTA",

    title: "什么是国债 Subasta（拍卖）？",

    shortTitle: "国债拍卖",

    layout: "auction",

    summary:
      "CETES、BONOS 等墨西哥国债不是每次点击后立刻进入持仓。购买会跟政府证券的发行和 Subasta 安排连接。",

    source:
      "参考：Cetesdirecto 官方 FAQ 与政府证券季度拍卖日历说明。",

    steps: [
      {
        icon: "document",

        title:
          "① 政府安排发行国债",

        description:
          "不同期限和品种按照政府证券拍卖日历开放。",
      },

      {
        icon: "auction",

        title:
          "② 墨西哥央行进行 Subasta",

        description:
          "Cetesdirecto 官方说明，政府证券拍卖通常在周二进行。",
      },

      {
        icon: "deposit",

        title:
          "③ Cetesdirecto 使用已准备的资金",

        description:
          "购买日到来后，平台根据客户已经设置的购买指令处理资金。",
      },

      {
        icon: "check",

        title:
          "④ 周四左右显示持仓",

        description:
          "官方 FAQ 说明，证券通常在周四完成分配并显示到投资组合中。",
      },
    ],

    knowBefore: [
      "通常每周都有政府证券拍卖，但具体产品和期限要看季度拍卖日历。",

      "提交购买指令后出现“Procesando（处理中）”是正常现象，不代表失败。",

      "Cetesdirecto FAQ 明确说明：只要购买所需资金充足，已安排的购买指令有保障，不存在因为超额认购而买不到的问题。",

      "BONDDIA 不需要等待国债 Subasta；向 Cetesdirecto 入金后，资金可以直接进入 BONDDIA。",
    ],
  },


  /*
   * =========================================
   * 08
   * Risks
   * =========================================
   */

  {
    id: "risks",

    section: "risk",

    number: 8,

    eyebrow: "RISK",

    title: "投资墨西哥国债前，要知道这 6 个风险",

    shortTitle: "主要风险",

    layout: "risk",

    summary:
      "墨西哥国债信用风险相对低，但不代表客户的最终投资结果没有其他风险。",

    source: null,

    risks: [
      {
        icon: "chart",
    
        title:
          "汇率风险",
    
        description:
          "如果您最终用人民币或美元衡量资产，MXN 汇率变化可能放大或抵消国债收益。",
      },
    
      {
        icon: "clock",
    
        title:
          "利率风险",
    
        description:
          "市场利率变化会影响中长期国债价格，BONOS 的价格波动通常比短期 CETES 更明显。",
      },
    
      {
        icon: "withdraw",
    
        title:
          "提前退出风险",
    
        description:
          "如果没有按照原计划持有，提前卖出时的实际结果可能不同于最初预计。",
      },
    
      {
        icon: "tax",
    
        title:
          "税务风险",
    
        description:
          "预扣税率、年度申报方式和个人税务义务可能随着规则及个人情况变化。",
      },
    
      {
        icon: "key",
    
        title:
          "操作风险",
    
        description:
          "CLABE、银行账户、身份资料、密码或安全验证操作错误，都可能导致流程失败或延迟。",
      },
    
      {
        icon: "document",
    
        title:
          "制度变化风险",
    
        description:
          "Cetesdirecto、墨西哥央行、SAT 或其他相关制度和平台规则未来都可能调整。",
      },
    ],
  },


  /*
   * =========================================
   * 9
   * Opening Practice
   * =========================================
   */

  {
    id: "opening-practice",

    section: "practice",

    number: 9,

    eyebrow: "PRACTICE",

    title: "开始测试：Cetesdirecto 实际开户",

    shortTitle: "开户实操",

    layout: "screenshots",

    summary:
      "从这里开始不再只是讲理论。我们直接看 Cetesdirecto 官方注册画面，并逐步完成开户测试。",

    source:
      "画面：Cetesdirecto 官方注册页面。",

      screenshots: [
        {
          src:
            "/consultation/cetes/opening-01-create-user.png",
      
          label:
            "STEP 1",
      
          title:
            "建立 Usuario（用户名）和密码",
      
          description:
            "填写姓名、Email，并另外建立 Usuario 和 Contraseña（密码）。",
      
          highlights: [
            "Email 只是电子邮箱，不等于 Usuario",
            "Usuario 是以后登录 Cetesdirecto 要输入的用户名",
            "Usuario 与 Contraseña（密码）都必须自己保存好",
            "密码必须符合页面显示的复杂度要求",
            "确认无误后再点击 Continuar（继续）",
          ],
        },
      
        {
          src:
            "/consultation/cetes/opening-02-location.png",
      
          label:
            "STEP 2",
      
          title:
            "允许 Geolocalización（地理定位）",
      
          description:
            "系统会要求浏览器提供当前设备地理位置。",
      
          highlights: [
            "看到“Tu ubicación es requerida”时，需要允许定位",
            "不要只关闭弹窗后继续，定位权限本身必须允许",
            "建议本人在墨西哥境内完成开户",
            "页面若一直加载，可重新开启新的无痕 Session（会话）再试",
          ],
        },
      
        {
          src:
            "/consultation/cetes/opening-03-security-questions.png",
      
          label:
            "STEP 3",
      
          title:
            "设置秘密问题和安全问题",
      
          description:
            "这里会同时出现 Pregunta Secreta（秘密问题）和 Preguntas de Seguridad（安全问题）。",
      
          highlights: [
            "Pregunta Secreta：主要秘密问题",
            "Preguntas de Seguridad：额外安全验证问题",
            "问题和答案都要自己完整记住",
            "忘记密码或恢复账户时可能会再次要求回答",
            "不要为了快速开户填写自己以后记不住的答案",
          ],
        },
      ],

    screenshotPoints: [
      {
        icon: "user",

        title:
          "Usuario ≠ Email",

        description:
          "这是最容易忘记的地方。Usuario 是独立登录用户名，不等于 Email（电子邮箱）。登录 Cetesdirecto 时需要输入 Usuario。",
      },

      {
        icon: "key",

        title:
          "一定记住 Usuario + 密码",

        description:
          "建议客户自行安全保存。我们不会记录这两项信息。",
      },

      {
        icon: "shield",

        title:
          "密保问题也一定要记住",

        description:
          "Cetesdirecto 官方明确要求找回密码时提供当前 Pregunta Secreta（秘密问题）和对应答案。注册页另外还有 Preguntas de Seguridad（安全问题），建议全部自行完整记录。",
      },

      {
        icon: "location",

        title:
          "必须允许定位",

        description:
          "数字金融操作需要启用 Geolocalización（地理定位）。本服务要求客户本人在墨西哥境内完成开户测试。",
      },

      {
        icon: "warning",

        title:
          "网页系统比较老",

        description:
          "如果页面持续转圈或无响应，不一定是资料错误。注册流程对浏览器、Session（会话）、定位和页面环境比较敏感。",
      },

      {
        icon: "clock",

        title:
          "页面卡住时的排查顺序",

        description:
          "先恢复西班牙语原始网页 → 重新开无痕窗口 → 确认允许定位 → 临时停用可能修改页面或阻挡脚本的浏览器插件 → 重新开始新的注册 Session（会话）。",
      },
    ],
  },

      /*
 * =========================================
 * 10
 * First Deposit
 * =========================================
 */

{
  id: "first-deposit",

  section: "practice",

  number: 10,

  eyebrow: "PRACTICE",

  title: "实操：首次入金",

  shortTitle: "首次入金",

  layout: "placeholder",

  summary:
    "开户完成后，下一步是理解资金怎样从本人银行账户进入 Cetesdirecto。第一次操作建议先把流程看懂，再决定实际转入金额。",

  source:
    "参考：Cetesdirecto 官方 FAQ — Envío de Dinero / SPEI。",

  placeholderTitle:
    "等待补充 Cetesdirecto 入金界面截图",

  placeholderDescription:
    "后续取得真实登录界面后，这里会直接展示入金页面、账户信息和 Movimientos 查询位置。",

  cards: [
    {
      icon: "bank",

      title:
        "资金从哪里来？",

      description:
        "资金由客户本人通过银行账户转入 Cetesdirecto。咨询人员不会代收、代转或接触客户资金。",
    },

    {
      icon: "deposit",

      title:
        "SPEI 转账",

      description:
        "Cetesdirecto 官方说明，可通过 SPEI（墨西哥银行间电子支付系统）向账户转入资金。",
    },

    {
      icon: "clock",

      title:
        "什么时候能看到？",

      description:
        "官方说明，一般可以在 1 个工作日内看到资金进入投资组合；当天也可以在 Movimientos / Ingresos / Efectivo 查看入账状态。",
    },

    {
      icon: "warning",

      title:
        "注意入金额度",

      description:
        "Nivel 2 / Contrato Exprés 每月累计入金不能超过 3,000 UDIS；超过额度可能导致资金退回。",
    },

    {
      icon: "document",

      title:
        "确认资金状态",

      description:
        "不要只看银行端“转账成功”。还要在 Cetesdirecto 内确认资金已经进入账户。",
    },
  ],
},


/*
 * =========================================
 * 11
 * e.firma Upgrade
 * =========================================
 */

{
  id: "efirma-upgrade",

  section: "practice",

  number: 11,

  eyebrow: "UPGRADE",

  title: "实操：使用 e.firma 提高账户等级",

  shortTitle: "e.firma 升级",

  layout: "placeholder",

  summary:
    "如果客户计划投入更高资金规模，可以从基础 Contrato Exprés 升级，提高账户资金操作能力。",

  source:
    "参考：Cetesdirecto 官方 FAQ — Incrementar capacidad de ahorro。",

  placeholderTitle:
    "等待补充 e.firma 升级界面截图",

  placeholderDescription:
    "后续取得真实页面后，这里会展示 Aumenta tu capacidad de ahorro / e.firma 升级操作界面。",

  cards: [
    {
      icon: "key",

      title:
        "准备 e.firma",

      description:
        "通常需要 SAT 签发的 `.cer`、`.key` 以及对应私钥密码。",
    },

    {
      icon: "shield",

      title:
        "私钥密码只由本人输入",

      description:
        "咨询人员不会索取、保存或代替客户输入 e.firma 私钥密码。",
    },

    {
      icon: "document",

      title:
        "准备银行证明",

      description:
        "官方流程可能要求登记银行账户的有效账单或相关账户证明。",
    },

    {
      icon: "chart",

      title:
        "升级后的作用",

      description:
        "Nivel 4 可以取消 Nivel 2 每月 3,000 UDIS 的累计入金限制，并提高账户可操作资金规模。",
    },
  ],
},


/*
 * =========================================
 * 12
 * Government Bond Purchase - Mobile App
 * =========================================
 */

{
  id: "purchase-practice",

  section: "practice",

  number: 12,

  eyebrow: "PRACTICE · MOBILE APP",

  title: "实操：购买国债（手机 App）",

  shortTitle: "购买国债",

  layout: "screenshots",

  summary:
    "这里先使用 Cetesdirecto 官方手机 App 说明国债购买流程。网页版操作画面后续会另外补充，但产品、金额、资金来源和 Subasta（拍卖）等核心逻辑基本一致。",

  source:
    "画面：Cetesdirecto 官方手机 App。收益率为截图当时显示的参考数据，不代表未来收益。",

  screenshots: [
    {
      src:
        "/consultation/cetes/app-products-list.jpeg",

      label:
        "APP · STEP 1",

      title:
        "先选择要查看的国债产品",

      description:
        "进入 Invertir（投资）后，可以看到 Valores Gubernamentales（政府证券）以及当前可以选择的产品和期限。",

      highlights: [
        "这是 Cetesdirecto 手机 App 画面，后续还会补充网页版购买界面",

        "CETES 可以看到不同期限，例如 1 个月、3 个月、6 个月、12 个月、2 年",

        "页面同时可以看到 BONOS、UDIBONO、BONDESF 等其他政府证券",

        "产品旁显示的收益率是当时页面的参考收益率，不代表未来固定收益",

        "先选择产品和期限，再进入下一步填写购买金额",
      ],
    },

    {
      src:
        "/consultation/cetes/app-purchase-form.jpeg",

      label:
        "APP · STEP 2",

      title:
        "填写购买金额并确认 Subasta",

      description:
        "进入具体国债后，可以看到参考收益率、Fecha de subasta（拍卖日期）、购买金额和 Forma de pago（资金来源）。",

      highlights: [
        "Tasa indicativa de referencia de la última subasta：上一期拍卖的参考收益率，不是对本次收益率的保证",

        "Fecha de subasta：本次购买指令对应的国债拍卖日期",

        "Monto de la compra：由客户本人决定实际购买金额",

        "Forma de pago：选择本次购买使用的资金来源",

        "Envío de recursos：通过资金转入支付",

        "BONDDIA：可以使用已经在 BONDDIA 中的流动资金",

        "Domiciliación：如果账户已经设置相关自动扣款方式，可按实际可用选项操作",

        "确认所有资料后才点击 Aceptar（确认）",
      ],
    },
  ],

  screenshotPoints: [
    {
      icon: "chart",

      title:
        "先选产品，再选期限",

      description:
        "CETES 不只有一种期限。客户需要先理解不同期限，再由本人决定选择哪一种。",
    },

    {
      icon: "auction",

      title:
        "注意 Subasta（国债拍卖）日期",

      description:
        "购买 CETES、BONOS 等国债时，需要理解购买指令和实际国债拍卖之间存在时间差。",
    },

    {
      icon: "deposit",

      title:
        "资金来源可以不同",

      description:
        "购买时可能看到 Envío de recursos、BONDDIA 或其他可用资金方式，实际选项以客户账户显示为准。",
    },

    {
      icon: "shield",

      title:
        "金额由客户本人决定",

      description:
        "咨询过程中只解释画面和流程，不替客户决定购买产品、期限或金额。",
    },

    {
      icon: "document",

      title:
        "手机 App ≠ 唯一操作方式",

      description:
        "这一页目前先使用官方 App 实操画面。后续取得网页版截图后，会加入网页版购买流程进行对照。",
    },
  ],
},

/*
 * =========================================
 * 13
 * Withdrawal
 * =========================================
 */

{
  id: "withdrawal-practice",

  section: "practice",

  number: 13,

  eyebrow: "PRACTICE",

  title: "实操：首次出金测试",

  shortTitle: "首次出金",

  layout: "placeholder",

  summary:
    "完成一次小额出金测试，可以让客户确认资金怎样从 Cetesdirecto 返回本人银行账户。",

  source:
    "参考：Cetesdirecto 官方 FAQ — Retiro de Recursos / Retiro Bonddia。",

  placeholderTitle:
    "等待补充 Cetesdirecto 出金界面截图",

  placeholderDescription:
    "取得真实界面后，这里会展示 Retirar / Retiro de recursos 的实际操作位置。",

  cards: [
    {
      icon: "withdraw",

      title:
        "提款到登记银行账户",

      description:
        "提款资金会进入客户在 Cetesdirecto 登记的本人银行账户。",
    },

    {
      icon: "clock",

      title:
        "工作日 13:00 前",

      description:
        "官方说明，工作日 13:00 前提交的提款指令，通常可以在当天进入银行账户。",
    },

    {
      icon: "warning",

      title:
        "确认后不能取消",

      description:
        "官方说明，当日提款指令一旦确认，通常不能再取消。",
    },

    {
      icon: "bank",

      title:
        "BONDDIA 可以直接提款",

      description:
        "如果资金在 BONDDIA，可以提交提款指令直接转回本人银行账户。",
    },

    {
      icon: "document",

      title:
        "国债可能涉及提前卖出",

      description:
        "如果资金仍投资在 CETES、BONOS 等国债中，需要先理解到期、提前卖出和提款之间的区别。",
    },
  ],
},


/*
 * =========================================
 * 14
 * Movements & Statement
 * =========================================
 */

{
  id: "movements-statement",

  section: "practice",

  number: 14,

  eyebrow: "ACCOUNT",

  title: "学会查 Movimientos 和 Estado de Cuenta",

  shortTitle: "账户记录",

  layout: "status",

  summary:
    "开户之后，客户应该知道在哪里确认资金有没有进来、有没有出去，以及在哪里下载正式账户记录。",

  source:
    "参考：Cetesdirecto 官方 FAQ。",

  statusItems: [
    {
      icon: "deposit",

      title:
        "Movimientos / Ingresos / Efectivo",

      description:
        "可以查看当天的资金入账情况。官方说明，即使投资组合还没更新，也可以先在这里确认资金是否已进入账户。",
    },

    {
      icon: "withdraw",

      title:
        "Movimientos",

      description:
        "用于查看入金、出金和其他账户操作记录，方便核对资金状态。",
    },

    {
      icon: "document",

      title:
        "Estado de Cuenta（账户对账单）",

      description:
        "官方路径：Perfil → Tus documentos → Estados de cuenta。",
    },

    {
      icon: "check",

      title:
        "养成核对习惯",

      description:
        "每次入金、出金或购买后，都建议回到 Movimientos 或投资组合确认实际状态。",
    },
  ],
},


/*
 * =========================================
 * 15
 * Cetesdirecto Mobile App
 * =========================================
 */

{
  id: "mobile-app",

  section: "practice",

  number: 15,

  eyebrow: "MOBILE APP",

  title: "Cetesdirecto 官方 App：登录、查看与出金",

  shortTitle: "官方 App",

  layout: "screenshots",

  summary:
    "完成开户后，日常查看账户、检查资金和执行出金都可以通过 Cetesdirecto 官方手机 App 完成。下面直接看真实操作画面。",

  source:
    "画面：Cetesdirecto 官方手机 App。截图中的个人账户资料及金额已做隐私处理。",

  screenshots: [
    /*
     * =====================================
     * APP STEP 1
     * Login
     * =====================================
     */

    {
      src:
        "/consultation/cetes/app-login.jpeg",

      label:
        "APP · STEP 1",

      title:
        "使用 Usuario（用户名）登录",

      description:
        "Cetesdirecto App 登录同样使用 Usuario，而不是直接使用 Email（电子邮箱）。",

      highlights: [
        "Usuario 是独立用户名，不等于注册 Email",

        "一定要保存好自己的 Usuario",

        "随后输入 Contraseña（密码）完成登录",

        "可以选择记住 Usuario，但是否启用由客户本人决定",

        "Recuperar contraseña 是密码恢复入口",

        "登录密码和任何 OTP（一次性动态验证码）只由客户本人输入",
      ],
    },


    /*
     * =====================================
     * APP STEP 2
     * Home
     * =====================================
     */

    {
      src:
        "/consultation/cetes/app-home-overview.jpeg",

      label:
        "APP · STEP 2",

      title:
        "首页查看账户和资金状态",

      description:
        "登录后首页可以快速查看账户总览、当前资金状态，以及 Invertir（投资）、Ahorro Recurrente（定期储蓄）和 Retirar（出金）入口。",

      highlights: [
        "首页可以查看账户投资总览",

        "Ingresos del mes：查看当月累计入金情况",

        "截图中的 Nivel 4 提示说明，高等级账户可以支持更大的资金操作规模",

        "Invertir：进入购买国债和其他可用投资产品",

        "Ahorro Recurrente：定期储蓄功能",

        "Retirar：进入资金出金流程",
      ],
    },


    /*
     * =====================================
     * APP STEP 3
     * Withdrawal Instrument
     * =====================================
     */

    {
      src:
        "/consultation/cetes/app-withdraw-select.jpeg",

      label:
        "APP · STEP 3",

      title:
        "进入 Retirar 并选择可出金资金",

      description:
        "进入 Retirar（出金）后，先选择目前可以执行提款的工具。截图中显示的是 BONDDIA。",

      highlights: [
        "先进入 Retirar（出金）",

        "系统会显示当前可以执行提款的工具",

        "截图中可以直接选择 BONDDIA",

        "BONDDIA 属于流动资金，因此提款操作比尚未到期的国债更直接",

        "页面显示的最大可操作金额要以客户自己的实时账户状态为准",
      ],
    },


    /*
     * =====================================
     * APP STEP 4
     * Withdrawal Form
     * =====================================
     */

    {
      src:
        "/consultation/cetes/app-withdraw-form.jpeg",

      label:
        "APP · STEP 4",

      title:
        "输入金额并检查银行资料",

      description:
        "进入 BONDDIA 出金页面后，需要确认可用余额、出金金额、收款银行、CLABE 和提款日期。",

      highlights: [
        "Monto actual：当前资金金额",

        "Saldo comprometido：已经被其他操作占用的资金",

        "Saldo disponible：目前真正可以执行提款的资金",

        "Importe a retirar：客户本人输入实际出金金额",

        "Banco a depositar：确认资金将转入的本人银行",

        "Terminación CLABE：再次核对收款 CLABE 尾号",

        "Fecha de retiro：确认本次提款日期",

        "所有银行资料正确后再点击 Aceptar（确认）",
      ],
    },


    /*
     * =====================================
     * APP STEP 5
     * Withdrawal Success
     * =====================================
     */

    {
      src:
        "/consultation/cetes/app-withdraw-success.jpeg",

      label:
        "APP · STEP 5",

      title:
        "确认 Retiro de Recursos 已成功登记",

      description:
        "提交成功后，App 会显示提款已经登记，并显示登记日期、金额和预计资金交付日期。",

      highlights: [
        "出现绿色确认标志代表提款指令已经成功登记",

        "Fecha de registro：提款指令登记日期",

        "Monto a depositar：本次要转回银行的金额",

        "Fecha de entrega de recursos：预计资金进入银行账户的日期",

        "建议确认成功页面后，再返回账户查看 Movimientos（交易记录）",

        "不要只看按钮有没有点成功，要确认系统确实显示 Retiro de Recursos registrado exitosamente",
      ],
    },
  ],

  screenshotPoints: [
    {
      icon: "user",

      title:
        "Usuario 不是 Email",

      description:
        "网页版和手机 App 都要记住自己的 Usuario（用户名）。这是整个账户使用中非常重要的信息。",
    },

    {
      icon: "chart",

      title:
        "App 可以直接查看账户",

      description:
        "日常可以在手机查看投资组合、资金状态和可用操作入口。",
    },

    {
      icon: "withdraw",

      title:
        "出金可以在 App 完成",

      description:
        "BONDDIA 等符合条件的资金可以直接通过 Retirar 流程提交提款。",
    },

    {
      icon: "bank",

      title:
        "资金只回本人登记银行",

      description:
        "执行出金前要特别核对银行名称和 CLABE，避免误操作。",
    },

    {
      icon: "shield",

      title:
        "手机同样注意账户安全",

      description:
        "密码、OTP（一次性动态验证码）、手机权限和所有最终确认都由客户本人管理。",
    },
  ],
},


/*
 * =========================================
 * 16
 * Completion
 * =========================================
 */

{
  id: "completion",

  section: "practice",

  number: 16,

  eyebrow: "COMPLETE",

  title: "完成咨询后，您应该已经会这些事",

  shortTitle: "完成事项",

  layout: "status",

  summary:
    "咨询结束的目标不是记住所有理论，而是让客户可以自己继续安全操作 Cetesdirecto。",

  source: null,

  statusItems: [
    {
      icon: "book",

      title:
        "理解主要国债产品",

      description:
        "知道 CETES、BONOS 和 BONDDIA 的基本差别。",
    },

    {
      icon: "user",

      title:
        "完成或掌握开户",

      description:
        "知道 Usuario、密码、密保问题和定位要求。",
    },

    {
      icon: "deposit",

      title:
        "掌握首次入金",

      description:
        "知道资金如何从银行进入 Cetesdirecto，并在哪里查看状态。",
    },

    {
      icon: "key",

      title:
        "知道什么时候需要 e.firma 升级",

      description:
        "理解 Nivel 2、Nivel 4 和 3,000 UDIS 的关系。",
    },

    {
      icon: "auction",

      title:
        "理解国债购买流程",

      description:
        "知道 Subasta、Procesando 和最终持仓之间的关系。",
    },

    {
      icon: "withdraw",

      title:
        "掌握首次出金",

      description:
        "知道资金如何返回本人银行账户。",
    },

    {
      icon: "document",

      title:
        "会查账户记录",

      description:
        "知道哪里看 Movimientos，以及哪里下载 Estado de Cuenta。",
    },

    {
      icon: "shield",

      title:
        "知道账户安全边界",

      description:
        "密码、OTP（一次性动态验证码）、e.firma 和资金都始终由自己控制。",
    },
  ],
},

];