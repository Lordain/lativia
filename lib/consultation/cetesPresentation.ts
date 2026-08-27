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
  | "status"
  | "yield-explainer"
  | "investment-comparison";


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

export interface YieldComparisonItem {
  title: string;

  value: string;

  description: string;
}


export interface YieldDifferenceRow {
  label: string;

  cetes: string;

  bonddia: string;
}


export interface ComparisonRow {
  product: string;

  type: string;

  yieldExample: string;

  purchase: string;

  purpose: string;
}


export interface InvestmentComparisonRow {
  product:
    string;

  risk:
    string;

  returnProfile:
    string;

  predictability:
    string;

  volatility:
    string;

  liquidity:
    string;

  emphasis?:
    boolean;
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

  summary: string;

  source?: string | null;

  cards?: PresentationCard[];

  comparisonRows?: ComparisonRow[];

  investmentComparisonRows?:
  InvestmentComparisonRow[];

  levelRows?: LevelRow[];

  yieldTimeline?: YieldComparisonItem[];

  yieldDifferenceRows?: YieldDifferenceRow[];

  yieldFormula?: {
    title: string;

    expression: string;

    example: string;
  };

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
 * Investment Comparison
 * =========================================
 */

{
  id:
    "investment-comparison",

  section:
    "products",

  number:
    3,

  eyebrow:
    "COMPARISON",

  title:
    "国债与常见投资方式比较",

  shortTitle:
    "投资方式比较",

  layout:
    "investment-comparison",

  summary:
    "先从风险、收益特点、收益确定性、价格波动和流动性几个维度，快速建立不同投资方式的基本概念。",

  source:
    "一般特征比较；实际风险与收益取决于具体产品、期限及市场环境，不构成投资建议。",

  investmentComparisonRows: [
    {
      product:
        "墨西哥国债",

      risk:
        "较低",

      returnProfile:
        "当前收益较有竞争力",

      predictability:
        "持有到期较明确",

      volatility:
        "相对较低",

      liquidity:
        "较好",

      emphasis:
        true,
    },

    {
      product:
        "银行定存",

      risk:
        "较低",

      returnProfile:
        "通常偏低",

      predictability:
        "较明确",

      volatility:
        "很低",

      liquidity:
        "通常较低",
    },

    {
      product:
        "基金",

      risk:
        "中等",

      returnProfile:
        "视基金类型而定",

      predictability:
        "不固定",

      volatility:
        "中等",

      liquidity:
        "通常较好",
    },

    {
      product:
        "股票",

      risk:
        "较高",

      returnProfile:
        "收益弹性较高",

      predictability:
        "不确定",

      volatility:
        "高",

      liquidity:
        "高",
    },
  ],
},


  /*
   * =========================================
   * 04
   * Product Comparison
   * =========================================
   */

  {
    id: "products-comparison",

    section: "products",

    number: 4,

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
          "活期投资账户（每日流动的债务投资基金）",

        yieldExample:
          "1 日指标约 6.34%",

        purchase:
          "无需另外购买；入金后资金可直接进入 BONDDIA",

        purpose:
          "账户内短期资金停放、等待后续购买或提款",
      },
    ],
  },


  /*
   * =========================================
   * 05
   * Account Levels
   * =========================================
   */

  {
    id: "account-levels",

    section: "account",

    number: 5,

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
          "外国人需持墨西哥合法居留身份",

        description:
          "外国申请人需具有墨西哥临时居留或永久居留身份，并准备相应的有效居留证明。",
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
          "设备需开启地理定位",

        description:
          "使用 Cetesdirecto 数字渠道登录和进行相关操作时，需要允许设备提供地理位置信息。",
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
 * 09
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
    "从 Cetesdirecto 官网开始，按真实开户顺序完成 Usuario 创建、定位、安全问题、手机与邮箱验证、个人资料、银行账户登记、合同签署，直到开户成功并测试登录。",

  source:
    "画面：Cetesdirecto 官方网页。截图中的个人资料、银行资料及其他敏感信息已做隐私处理。",

  screenshots: [
    {
      src:
        "/consultation/cetes/opening-00-home.jpg",

      label:
        "WEB · STEP 0",

      title:
        "进入 Cetesdirecto 官方网站",

      description:
        "开户首先从 Cetesdirecto 官方网站进入 Abre tu cuenta（开户）流程。",

      highlights: [
        "先确认进入正确的 Cetesdirecto 官方网站",

        "点击 Abre tu cuenta 开始开户",

        "首页可能显示 CETES、BONOS 等产品的参考收益率",

        "页面显示的收益率只是当时参考，不代表未来保证收益",

        "不要从来源不明的第三方链接输入账户资料",
      ],
    },

    {
      src:
        "/consultation/cetes/opening-01-create-user.png",

      label:
        "WEB · STEP 1",

      title:
        "创建 Usuario（用户名）和密码",

      description:
        "填写基本联系资料，同时建立以后登录 Cetesdirecto 使用的 Usuario 和 Contraseña（密码）。",

      highlights: [
        "Usuario 不等于 Email；Usuario 是独立登录用户名",

        "Usuario 最少需要 6 个字符",

        "Contraseña（密码）最少需要 8 个字符",

        "密码至少包含 1 个大写字母、1 个小写字母和 1 个数字",

        "允许使用的特殊字符为：#  %  &  ?  _",

        "特殊字符最多使用 2 个",

        "密码不能包含 nafin、cetes 等相关字样",

        "连续顺序字符和连续重复字符均有限制",

        "Usuario 与密码必须由客户本人保存",
      ],
    },

    {
      src:
        "/consultation/cetes/opening-02-location.png",

      label:
        "WEB · STEP 2",

      title:
        "允许 Geolocalización（地理定位）",

        description:
        "注册过程中 Cetesdirecto 会要求浏览器取得当前设备的 Geolocalización（地理位置）。这是数字金融渠道的监管要求，重点是允许系统取得真实的当前设备位置，并不代表开户操作必须在墨西哥境内完成。",
      
      highlights: [
        "看到 Tu ubicación es requerida 时，需要允许定位",
      
        "浏览器或手机本身的定位权限也必须开启",
      
        "Cetesdirecto 需要取得并保存当前操作设备的真实地理位置",
      
        "开户操作本身不要求客户必须物理位于墨西哥境内",
      
        "外国申请人仍必须具备墨西哥临时居留或永久居留身份，并满足 RFC、CURP、本人墨西哥银行账户等开户条件",
      
        "如果页面持续加载，可以重新开启无痕 Session（会话）再试",
      
        "如果页面异常，先关闭浏览器自动翻译及可能干扰网页脚本的插件",
      ],
    },

    {
      src:
        "/consultation/cetes/opening-03-security-questions.png",

      label:
        "WEB · STEP 3",

      title:
        "设置秘密问题和安全问题",

      description:
        "开户会要求设置 Pregunta Secreta（秘密问题）与 Preguntas de Seguridad（安全问题），用于以后账户验证和密码恢复。",

      highlights: [
        "Pregunta Secreta：主要秘密问题",

        "Preguntas de Seguridad：额外的安全验证问题",

        "秘密问题和安全问题不要选择重复的问题",

        "所有问题和答案都要由客户本人完整记录并保存",

        "遗忘问题或答案会增加账户恢复难度；在线恢复失败时可能需要联系 Cetesdirecto 客服人工处理",

        "不要为了快速开户随意填写以后自己也记不住的答案",
      ],
    },

    {
      src:
        "/consultation/cetes/opening-04-phone-verification.png",

      label:
        "WEB · STEP 4",

      title:
        "验证手机号码",

      description:
        "系统会向登记的手机号码发送一个 6 位验证码，以确认客户能够正常使用该号码。",

      highlights: [
        "先核对页面显示的手机号",

        "点击 Enviar Código（发送验证码）",

        "系统通过 SMS（短信）发送 6 位验证码",

        "验证码由客户本人接收和输入",

        "验证码不要提供给咨询人员或第三方",
      ],
    },

    {
      src:
        "/consultation/cetes/opening-05-email-verification.png",

      label:
        "WEB · STEP 5",

      title:
        "验证 Email（电子邮箱）",

      description:
        "手机验证之后，系统会继续验证注册时登记的 Email。",

      highlights: [
        "确认页面显示的 Email 正确",

        "点击 Enviar Código（发送验证码）",

        "邮箱会收到一个 6 位验证码",

        "没有收到时先检查 Spam / 垃圾邮件",

        "手机与邮箱验证码都是一次性安全验证信息",
      ],
    },

    {
      src:
        "/consultation/cetes/opening-06-personal-data.png",

      label:
        "WEB · STEP 6",

      title:
        "填写 Datos personales（个人资料）",

      description:
        "完成联系方式验证后，进入个人身份和税务资料填写阶段。",

      highlights: [
        "País de Nacimiento：选择真实出生国家",

        "如果出生在墨西哥以外，Entidad Federativa de Nacimiento 选择外国人 / Extranjero 对应选项",

        "Nacionalidad：填写真实国籍",

        "Fecha de nacimiento：填写实际出生日期",

        "RFC：墨西哥税号，注意核对 homoclave",

        "CURP：墨西哥身份识别号码",

        "Actividad Económica：选择实际经济活动 / 职业类别",

        "所有资料必须与客户真实身份信息一致",
      ],
    },

    {
      src:
        "/consultation/cetes/opening-07-bank-info.png",

      label:
        "WEB · STEP 7",

      title:
        "登记地址、本人银行账户和受益人",

      description:
        "这一阶段会继续填写 Domicilio（地址）、Datos Bancarios（银行资料）以及 Beneficiarios（受益人）。这里就是 Cetesdirecto 登记客户本人银行账户的关键步骤。",

      highlights: [
        "Domicilio：填写墨西哥居住地址",

        "Cuenta Bancaria：填写本人银行账户资料，官方页面建议使用 CLABE",

        "CLABE 是墨西哥银行账户的 18 位标准银行号码",

        "Banco Emisor：选择这条银行账户对应的银行",

        "页面明确要求登记的银行账户必须由客户本人持有",

        "这条已登记银行账户会用于后续资金转入、取回及账户验证",

        "Ahorro Recurrente（定期储蓄）属于可选功能，不需要为了开户强制开启",

        "Beneficiarios：按照实际情况填写账户受益人",
      ],
    },

    {
      src:
        "/consultation/cetes/opening-08-contract-signing.png",

      label:
        "WEB · STEP 8",

      title:
        "阅读合同并完成电子签署",

      description:
        "资料登记完成后，Cetesdirecto 会生成开户合同及相关附件。客户需要自行阅读并确认，然后完成电子签署。",

      highlights: [
        "页面会提供 Contrato（合同）",

        "同时可能包含 Anexo A、Anexo B、Anexo C 和 Aviso 等附件",

        "客户应自行阅读合同及相关文件",

        "确认资料与条款后选择 Acepto（接受）",

        "点击 Firmar Electrónicamente（电子签署）完成基础开户合同签署",

        "这一阶段属于开户合同签署，不是后续提高账户额度使用的 SAT e.firma 升级流程",
      ],
    },

    {
      src:
        "/consultation/cetes/opening-09-registration-success.png",

      label:
        "WEB · STEP 9",

      title:
        "确认 Contratación Exitosa（开户成功）",

      description:
        "出现 Contratación Exitosa 后，表示基础账户开户流程已经成功完成。",

      highlights: [
        "Contratación Exitosa 表示基础开户完成",

        "可以再次查看 Contrato 与各项附件",

        "基础账户通常以 Contrato Exprés 模式建立",

        "页面会开始说明如何进行第一次购买和资金转入",

        "开户成功后，下一步就是登录账户并测试首次入金",
      ],
    },

    {
      src:
        "/consultation/cetes/opening-10-login.png",

      label:
        "WEB · STEP 10",

      title:
        "开户完成后测试正式登录",

      description:
        "完成开户后，使用之前建立的 Usuario 和 Contraseña 登录 Cetesdirecto。",

      highlights: [
        "再次确认：Usuario 不等于 Email",

        "首先输入之前创建的 Usuario",

        "然后输入 Contraseña（密码）",

        "Recuperar Contraseña 是密码恢复入口",

        "密码恢复可能需要之前设置的安全问题、登记手机或其他身份验证",

        "成功登录后即可进入 Portafolio、Invertir、Retirar、Movimientos 等账户功能",
      ],
    },
  ],

  screenshotPoints: [
    {
      icon: "user",

      title:
        "Usuario ≠ Email",

      description:
        "Usuario 是独立登录用户名，开户以后仍然需要长期保存。",
    },

    {
      icon: "key",

      title:
        "账户安全资料必须自己保存",

      description:
        "密码、秘密问题、安全问题和验证码全部由客户本人控制。",
    },

    {
      icon: "bank",

      title:
        "开户阶段就会登记本人银行账户",

      description:
        "Cuenta Bancaria / CLABE 并不是首次入金时才填写，而是在开户资料阶段已经登记。",
    },

    {
      icon: "document",

      title:
        "开户最后需要确认合同",

      description:
        "资料登记完成后，需要阅读合同、附件并完成基础账户的电子签署。",
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
      
        title: "首次入金：把资金转入 Cetesdirecto",
      
        shortTitle: "首次入金",
      
        layout: "screenshots",
      
        summary:
          "开户完成后，下一步是把本人墨西哥银行账户中的资金转入 Cetesdirecto。这里重点认识 Envío de recursos（发送资金）、BONDDIA 和 SPEI 转账方式。",
      
        source:
          "画面：Cetesdirecto 官方网页。实际银行名称、CLABE、金额及可用功能以客户账户当时显示为准。",
      
        screenshots: [
          {
            src:
              "/consultation/cetes/web-deposit-spei.png",
      
            label:
              "WEB · STEP 1",
      
            title:
              "查看 Envío de recursos 与 SPEI 入金方式",
      
            description:
              "Cetesdirecto 会提供资金转入说明。客户从自己名下已经登记的墨西哥银行账户，通过 SPEI 转账至页面显示的 Cetesdirecto 入金账户。",
      
              highlights: [
                "入金应在银行工作日操作；晚上、周末或银行非工作日不要转账",
              
                "Cetesdirecto 当前官方可用时间说明显示，SPEI 入金通常为周一至周五银行工作日 06:00–17:00",
              
                "官方 FAQ 同时说明：如果在规定时间之外或 Cetesdirecto 非工作日转入，资金可能被退回原银行账户",
              
                "因此实际操作时，应以客户账户当时页面显示的入金时间为准，并尽量安排在工作日上午或下午较早时段",
              
                "如果 NAFIN 在当天 13:00 前收到 SPEI，官方说明资金可以在当天被计入流动投资",
              
                "入金前再次确认 Cetesdirecto 页面显示的收款 CLABE",
              
                "转入后可在 Movimientos → Ingresos → Efectivo 检查资金是否已经进入账户",
              ],
          },
        ],
      
        screenshotPoints: [
          {
            icon: "clock",
        
            title:
              "入金时间非常重要",
        
            description:
              "只在银行工作日、Cetesdirecto 允许的 SPEI 入金时段操作。晚上、周末或非工作日转入可能被退回。",
          },
        
          {
            icon: "bank",
        
            title:
              "必须核对入金 CLABE",
        
            description:
              "实际收款 CLABE 以客户登录 Cetesdirecto 后当前页面显示为准。",
          },
        
          {
            icon: "deposit",
        
            title:
              "完成第一次真实入金测试",
        
            description:
              "首次咨询优先完成一笔实际小额入金，确认银行 → Cetesdirecto 的资金路径正常。",
          },
        
          {
            icon: "document",
        
            title:
              "到 Movimientos 确认",
        
            description:
              "转账后不要只看首页余额，也可以到 Movimientos → Ingresos → Efectivo 查看资金记录。",
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

  eyebrow: "ACCOUNT UPGRADE",

  title: "e.firma：提高 Cetesdirecto 账户能力",

  shortTitle: "e.firma 升级",

  layout: "screenshots",

  summary:
    "基础开户通常先建立 Contratación Exprés。需要提高账户资金操作能力时，可以进入 Escalar con e.firma，使用客户本人 SAT e.firma 完成线上升级。",

  source:
    "画面：Cetesdirecto 官方网页。截图中的证书、账户及个人资料已做隐私处理。实际页面和要求以客户操作时显示为准。",

  screenshots: [
    {
      src:
        "/consultation/cetes/efirma-01-upgrade-entry.png",

      label:
        "WEB · STEP 1",

      title:
        "进入 Escalar con e.firma",

      description:
        "登录账户后进入 Escalar con e.firma。页面会说明当前 Contratación Exprés 的限制，以及使用 e.firma 提高账户能力的方式。",

        highlights: [
          "这一流程发生在基础账户已经开户之后",
        
          "当前账户为 Contratación Exprés",
        
          "通过 e.firma 可以提高账户资金操作能力",
        
          "点击 Contratación con e.firma 进入升级流程",
        ],
    },

    {
      src:
        "/consultation/cetes/efirma-02-upload-files.png",

      label:
        "WEB · STEP 2",

      title:
        "上传 .cer、.key 并输入 e.firma 密码",

      description:
        "进入签署流程后，系统要求客户提供 SAT e.firma 的证书、私钥以及对应密码。",

      highlights: [
        "Certificado (.cer)：e.firma 证书文件",

        "Llave Privada (.key)：e.firma 私钥文件",

        "Clave de Acceso：这组 e.firma 私钥对应的密码",

        ".cer、.key 与密码必须属于同一套有效 e.firma",

        "三个资料均由客户本人选择和输入",

        "咨询人员不接收、不保存、不代客户输入 .key 或 e.firma 密码",

        "填写完成后点击 Continuar",
      ],
    },

    {
      src:
        "/consultation/cetes/efirma-03-certificate-review.png",

      label:
        "WEB · STEP 3",

      title:
        "核对 e.firma 证书资料",

      description:
        "系统读取 e.firma 后，会显示证书相关信息。客户需要先确认资料无误，再继续电子签署。",

        highlights: [
          "Serie：证书序列资料",
        
          "Vigencia：证书有效期",
        
          "Autoridad：签发机构信息",
        
          "确认系统正确读取自己的 e.firma",
        
          "确认正确后点击 Continuar",
        ],
    },

    {
      src:
        "/consultation/cetes/efirma-04-success.png",

      label:
        "WEB · STEP 4",

      title:
        "确认 e.firma 电子签署成功",

      description:
        "系统显示电子签署成功后，表示本次 e.firma 签署流程已经完成。",

        highlights: [
          "El proceso de firma electrónica ha finalizado con éxito 表示电子签署成功",
        
          "页面会显示签署结果",
        
          "随后重新登录账户确认账户等级 / 资金操作能力是否已经更新",
        ],
    },
  ],

  screenshotPoints: [
    {
      icon: "document",

      title:
        "先有基础账户，再做升级",

      description:
        "e.firma 不是基础开户的必需前提；Contrato Exprés 可以先完成，之后再升级。",
    },

    {
      icon: "key",

      title:
        "e.firma 三项资料",

      description:
        ".cer 证书、.key 私钥，以及与私钥对应的 Clave de Acceso（密码）。",
    },

    {
      icon: "shield",

      title:
        "所有签署操作由本人完成",

      description:
        "平台和咨询人员不接收客户 .key、不保管 e.firma 密码，也不代客户完成电子签署。",
    },

    {
      icon: "check",

      title:
        "成功后重新确认账户状态",

      description:
        "完成签署后重新登录 Cetesdirecto，确认账户能力已经更新。",
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
  id: "government-securities-purchase",

  section: "practice",

  number: 12,

  eyebrow: "PRACTICE",

  title: "购买国债：从选择产品到提交购买",

  shortTitle: "购买国债",

  layout: "screenshots",

  summary:
    "Cetesdirecto 可以通过 App 或网页操作。这里用真实画面认识从选择政府证券、期限、金额、资金来源，到最终确认购买的完整路径。",

  source:
    "画面：Cetesdirecto 官方 App 与网页。截图中的收益率、日期和金额仅用于操作演示，不代表当前或未来收益。",

    screenshots: [
      {
        src:
          "/consultation/cetes/web-products-list.png",
    
        label:
          "WEB · STEP 1",
    
        title:
          "进入 Invertir（投资）",
    
        description:
          "登录网页版后进入 Invertir（投资），可以看到当前开放购买的 CETES、BONOS、UDIBONO、BONDESF 等政府证券。",
    
        highlights: [
          "进入 Invertir（投资）",
    
          "查看当前开放购买的政府证券",
    
          "不同产品的期限和结构不同",
    
          "页面显示的产品会根据拍卖安排变化",
    
          "咨询服务只解释操作流程，不替客户选择产品",
        ],
      },
    
      {
        src:
          "/consultation/cetes/web-cetes-terms.png",
    
        label:
          "WEB · STEP 2",
    
        title:
          "选择 CETES 期限，并通过 Subasta（拍卖）购买",
    
        description:
          "CETES 不是像股票一样即时买入。客户选择期限后，需要选择对应的 Subasta（拍卖）批次提交购买指令。",
    
        highlights: [
          "先选择 CETES",
    
          "再选择具体期限",
    
          "选择 Subasta（拍卖）批次",
    
          "Cetesdirecto 的政府证券购买通过拍卖安排执行",
    
          "不同期限可能显示不同参考收益率",
    
          "客户本人决定购买期限和金额",
        ],
      },
    
      {
        src:
          "/consultation/cetes/web-bonos-terms.png",
    
        label:
          "WEB · EXTRA",
    
        title:
          "BONOS 的期限选择示例",
    
        description:
          "BONOS 属于期限更长的墨西哥政府证券，这里用来认识它和 CETES 在期限上的差异。",
    
        highlights: [
          "BONOS 通常属于较长期政府证券",
    
          "页面会显示当前开放的期限",
    
          "长期债券提前出售时可能受到市场价格变化影响",
    
          "此处只做产品与操作说明，不构成投资建议",
        ],
      },
    
      {
        src:
          "/consultation/cetes/web-purchase-form.png",
    
        label:
          "WEB · STEP 3",
    
        title:
          "填写购买指令",
    
        description:
          "选择产品和拍卖批次后，进入 Compra de instrumento 页面填写金额、资金来源等资料。",
    
        highlights: [
          "确认 Instrumento（产品）",
    
          "确认 Fecha de subasta（拍卖日期）",
    
          "填写 Monto（金额）",
    
          "选择 Forma de pago（资金来源）",
    
          "确认 Reinversión（到期自动再投资）设置",
    
          "最终购买指令由客户本人确认",
        ],
      },
    
      {
        src:
          "/consultation/cetes/web-purchase-summary.png",
    
        label:
          "WEB · STEP 4",
    
        title:
          "检查 Resumen de compra",
    
        description:
          "正式提交前检查购买摘要，确认产品、期限、金额、资金来源等信息。",
    
        highlights: [
          "核对产品",
    
          "核对期限和金额",
    
          "确认资金来源",
    
          "确认 Reinversión 设置",
    
          "确认无误后由客户本人提交",
        ],
      },
    
      {
        src:
          "/consultation/cetes/web-purchase-confirmation.png",
    
        label:
          "WEB · STEP 5",
    
        title:
          "确认购买指令已经登记",
    
        description:
          "出现购买登记成功信息后，表示指令已经进入后续处理流程。",
    
        highlights: [
          "Compra registrada 表示购买指令已登记",
    
          "登记成功不等于证券已经立即进入账户",
    
          "后续可以到 Movimientos 查看订单状态",
    
          "政府证券通常要等相应拍卖与分配流程完成",
        ],
      },
    
      {
        src:
          "/consultation/cetes/app-products-list.jpeg",
    
        label:
          "APP · STEP 1",
    
        title:
          "App：选择政府证券",
    
        description:
          "手机 App 同样可以进入 Invertir，选择 CETES、BONOS 等产品。",
    
        highlights: [
          "App 与 Web 的核心逻辑一致",
    
          "先选择产品",
    
          "再选择期限",
    
          "页面可能显示参考收益率",
    
          "客户本人决定购买内容",
        ],
      },
    
      {
        src:
          "/consultation/cetes/app-purchase-form.png",
    
        label:
          "APP · STEP 2",
    
        title:
          "App：填写购买指令",
    
        description:
          "在手机 App 中确认拍卖日期、金额以及支付方式，然后提交购买指令。",
    
        highlights: [
          "确认产品和期限",
    
          "确认 Fecha de subasta",
    
          "填写购买金额",
    
          "选择资金来源",
    
          "最后由客户本人确认提交",
        ],
      },
    ],

  screenshotPoints: [
    {
      icon: "auction",

      title:
        "购买国债会经过拍卖 / 处理流程",

      description:
        "提交购买指令之后，不要简单理解成即时股票成交；需要根据产品和拍卖安排完成后续处理。",
    },

    {
      icon: "bank",

      title:
        "资金来源要确认",

      description:
        "购买前确认资金已经可用，并明确使用 BONDDIA、转入资金或其他当时页面允许的资金方式。",
    },

    {
      icon: "shield",

      title:
        "客户本人发出购买指令",

      description:
        "咨询人员只解释界面和流程，不替客户决定产品、期限、金额，也不代客户点击最终购买。",
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
  id: "first-withdrawal",

  section: "practice",

  number: 13,

  eyebrow: "PRACTICE",

  title: "首次出金：从 Cetesdirecto 转回银行",

  shortTitle: "首次出金",

  layout: "screenshots",

  summary:
    "完成首次入金之后，还要确认资金能够正常从 Cetesdirecto 转回本人登记的银行账户。第一次出金测试是整个资金闭环的重要步骤。",

  source:
    "画面：Cetesdirecto 官方网页。实际可提金额、银行资料、到账时间及操作时段以客户账户页面当时显示为准。",

  screenshots: [
    {
      src:
        "/consultation/cetes/web-withdraw-select.png",

      label:
        "WEB · STEP 1",

      title:
        "进入 Retirar 并选择 BONDDIA",

      description:
        "在网页版进入 Retirar（取回资金），首先选择用于提款的产品。流动资金通常从 BONDDIA 进入提款流程。",

      highlights: [
        "进入 Retirar（提款 / 取回资金）",

        "选择页面允许提款的产品",

        "如果资金目前仍投资在尚未到期的政府证券中，情况与 BONDDIA 可用余额不同",

        "本次测试重点是验证正常可用资金能否成功返回本人银行账户",
      ],
    },

    {
      src:
        "/consultation/cetes/web-withdraw-form.png",

      label:
        "WEB · STEP 2",

      title:
        "填写出金金额并确认银行账户",

      description:
        "进入 Retiro de recursos（资金取回）页面后，查看可用余额，填写提款金额，并核对接收资金的银行账户。",

      highlights: [
        "Monto valuado：当前估值金额",

        "Saldo comprometido：已经被其他指令占用的金额",

        "Saldo disponible：当前可用于提款的余额",

        "Importe a retirar：这次准备取回的金额",

        "Banco receptor：接收资金的银行",

        "Cuenta de depósito / CLABE：确认是本人已经登记的银行账户",

        "Fecha de retiro：确认提款日期",

        "页面如提示当日到账操作时限，应以当前 Cetesdirecto 页面显示的时间规则为准",
      ],
    },
  ],

  screenshotPoints: [
    {
      icon: "withdraw",

      title:
        "完成第一次真实出金测试",

      description:
        "首次咨询尽量完成一笔实际的小额出金，确认 Cetesdirecto → 本人银行账户的路径正常。",
    },

    {
      icon: "bank",

      title:
        "资金只能回到登记账户",

      description:
        "提款时重点核对 Banco receptor 和已经登记的本人银行账户资料。",
    },

    {
      icon: "clock",

      title:
        "提款时间：工作日 09:00–13:00",

      description:
        "Cetesdirecto 当前官方说明，提款指令通常在银行工作日 09:00–13:00 操作；13:00 前完成的提款可在当天进入已登记银行账户。超过时间则需要选择之后的银行工作日。",
    },

    {
      icon: "shield",

      title:
        "不代客户操作资金",

      description:
        "金额、提款日期以及最终确认均由客户本人完成。",
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
  id: "account-records",

  section: "practice",

  number: 14,

  eyebrow: "ACCOUNT CHECK",

  title: "账户记录：怎么看操作有没有成功？",

  shortTitle: "账户记录",

  layout: "screenshots",

  summary:
  "入金、购买国债、卖出和出金之后，都可以通过 Movimientos（账户操作记录）核对。这里不仅能看交易历史，也能确认资金入账以及购买指令当前处于什么状态。",

  source:
    "画面：Cetesdirecto 官方网页。不同操作类型可能显示不同字段和状态。",

  screenshots: [
    {
      src:
        "/consultation/cetes/web-movements-history.png",

      label:
        "WEB · MOVIMIENTOS",

      title:
        "查看 Histórico venta 与操作状态",

      description:
        "Movimientos 页面可以查看历史操作及处理状态，是核对购买、出售和资金动作是否成功的重要位置。",

        highlights: [
          "Movimientos 不只是看卖出记录，也可以查看入金记录",
        
          "入金后可进入 Movimientos → Ingresos → Efectivo 确认资金是否已经进入 Cetesdirecto",
        
          "购买国债下单后，也可以通过 Movimientos 查看订单当前状态",
        
          "Procesando：购买或操作仍在处理中",
        
          "Aplicada：操作已经成功应用 / 完成处理",
        
          "Cancelada：该操作已经取消或未继续完成",
        
          "Instrumento：对应的产品",
        
          "Estatus：当前处理状态",
        
          "Importe instruido：最初提交的指令金额",
        
          "不要只根据首页余额判断操作是否成功，应同时检查 Movimientos",
        ],
    },
  ],

  screenshotPoints: [
    {
      icon: "deposit",
  
      title:
        "检查入金",
  
      description:
        "银行转账后可以到 Movimientos → Ingresos → Efectivo 查看入金记录。",
    },
  
    {
      icon: "clock",
  
      title:
        "检查购买订单状态",
  
      description:
        "国债下单后可能先显示 Procesando，表示仍在等待拍卖、分配或后续处理。",
    },
  
    {
      icon: "check",
  
      title:
        "确认最终状态",
  
      description:
        "Aplicada 通常表示操作已经成功处理；不要仅凭首页金额判断。",
    },
  
    {
      icon: "document",
  
      title:
        "Movimientos 是重要核对入口",
  
      description:
        "入金、购买、卖出和出金之后，都建议回到这里检查实际记录和状态。",
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
        "/consultation/cetes/app-withdraw-success.png",

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
      icon: "user",
      title: "完成基础开户",
      description:
        "已经建立 Cetesdirecto 账户，并可以使用 Usuario 与密码正常登录。",
    },
  
    {
      icon: "shield",
      title: "知道账户安全边界",
      description:
        "账号、密码、验证码、安全问题、.key 与 e.firma 密码全部由客户本人控制，咨询平台不代为保管或操作。",
    },
  
    {
      icon: "deposit",
      title: "完成首次入金",
      description:
        "已经验证本人银行账户 → Cetesdirecto 的资金转入路径。",
    },
  
    {
      icon: "key",
      title: "了解 e.firma 升级",
      description:
        "知道什么时候需要升级账户，以及 .cer、.key 和密码如何用于升级与签署。",
    },
  
    {
      icon: "auction",
      title: "完成首次购买操作",
      description:
        "已经理解 Invertir → 产品 → 期限 → Subasta → 金额 → 资金来源 → 提交的完整流程。",
    },
  
    {
      icon: "withdraw",
      title: "完成首次出金测试",
      description:
        "已经验证 Cetesdirecto → 本人登记银行账户的资金返回路径。",
    },
  
    {
      icon: "document",
      title: "会查看账户记录",
      description:
        "知道如何通过 Movimientos 检查入金、购买订单及其他操作的实际处理状态。",
    },
  
    {
      icon: "check",
      title: "可以独立完成基本操作",
      description:
        "完成咨询后，客户应能够自行完成登录、入金、购买、出金和账户记录检查，不依赖平台代为操作。",
    },
  ],
},

/*
 * =========================================
 * 17
 * Why CETES Value Changes Every Day
 * =========================================
 */

{
  id: "cetes-daily-value",

  section: "practice",

  number: 17,

  eyebrow: "EXTRA",

  title: "为什么 CETES 账户里的金额每天都在变？",

  shortTitle: "CETES 金额变化",

  layout: "yield-explainer",

  summary:
    "最容易产生的误解是：看到 CETES 金额每天增加，就以为政府每天在支付利息。实际上，CETES 不是每天派息的产品。",

  source:
    "参考：Cetesdirecto 官方 CETES 产品说明、Venta Anticipada 说明；Banco de México CETES 面值资料。",

  yieldTimeline: [
    {
      title:
        "买入时",

      value:
        "低于 MXN 10",

      description:
        "CETES 属于折价发行的短期墨西哥国债。买入价格通常低于每张 MXN 10 的到期面值。",
    },

    {
      title:
        "持有期间",

      value:
        "当前价值会变化",

      description:
        "账户看到的 CETES 当前价值可能随着时间和市场价格变化，因此金额并不会每天完全一样。",
    },

    {
      title:
        "到期时",

      value:
        "MXN 10 / 张",

      description:
        "如果一直持有到期，每张 CETES 按 MXN 10 面值结算。",
    },
  ],

  yieldFormula: {
    title:
      "最简单的收益理解",

    expression:
      "到期收益 ≈ 到期面值 − 买入成本",

    example:
      "例：10,000 张 × MXN 9.80 = MXN 98,000 → 到期 10,000 × MXN 10 = MXN 100,000",
  },

  yieldDifferenceRows: [
    {
      label:
        "每天看到金额变化的原因",

      cetes:
        "当前持仓价值随时间和市场条件变化",

      bonddia:
        "基金净值和每日收益变化",
    },

    {
      label:
        "是不是每天派现金利息",

      cetes:
        "不是",

      bonddia:
        "也不是传统银行存款的“每日现金派息”",
    },

    {
      label:
        "最终收益逻辑",

      cetes:
        "折价买入，到期按 MXN 10 面值结算",

      bonddia:
        "按照基金持有期间的净值 / 收益变化",
    },

    {
      label:
        "是否需要等到期",

      cetes:
        "可以持有到期，也可以 Venta Anticipada（提前卖出）",

      bonddia:
        "活期投资账户，可按规则自由提款",
    },
  ],

  cards: [
    {
      icon: "chart",

      title:
        "金额增加 ≠ 每天派息",

      description:
        "看到 CETES 当前价值增加，不代表每天有一笔利息现金打进账户。",
    },

    {
      icon: "document",

      title:
        "CETES 是零息国债",

      description:
        "核心逻辑是低于面值买入，到期按每张 MXN 10 面值偿还。",
    },

    {
      icon: "clock",

      title:
        "距离到期越近",

      description:
        "在其他市场条件没有明显变化的情况下，CETES 的价格通常会逐步接近到期面值。",
    },

    {
      icon: "warning",

      title:
        "提前卖出不是固定利息结算",

      description:
        "Venta Anticipada（提前卖出）按当时可执行的市场条件处理，不是简单按照“持有天数 × 原利率”计算。",
    },

    {
      icon: "chart",

      title:
        "提前卖出可能有价格风险",

      description:
        "如果市场利率发生变化，提前卖出时的实际结果可能高于或低于原来持有到期的预期。",
    },

    {
      icon: "check",

      title:
        "持有到期最容易理解",

      description:
        "如果一直持有至到期，CETES 的基本结算逻辑就是每张 MXN 10 面值。",
    },
  ],
},


  /*
   * =========================================
   * 18
   * Tax
   * =========================================
   */

  {
    id: "tax-withholding",

    section: "tax",

    number: 18,

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

];
