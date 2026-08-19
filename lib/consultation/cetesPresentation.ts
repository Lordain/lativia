export type CetesPresentationSection =
  | "intro"
  | "products"
  | "risk"
  | "account"
  | "operation"
  | "tax"
  | "closing";


export interface CetesPresentationSlide {
  id: string;

  section:
    CetesPresentationSection;

  number:
    number;

  title:
    string;

  shortTitle:
    string;

  eyebrow:
    string;

  summary:
    string;

  bullets:
    string[];

  note:
    string | null;
}


export const cetesPresentationSlides:
  CetesPresentationSlide[] = [
    {
      id:
        "consultation-goal",

      section:
        "intro",

      number:
        1,

      eyebrow:
        "CONSULTATION",

      title:
        "今天这次咨询会完成什么？",

      shortTitle:
        "咨询目标",

      summary:
        "先理解 Cetesdirecto 与相关产品，再由客户本人完成实际账户与资金操作。",

      bullets: [
        "理解 CETES、BONOS、BONDDIA 的基本区别",
        "了解 Cetesdirecto 的账户与资金操作逻辑",
        "确认开户条件与账户设置",
        "了解账户等级与 e.firma 升级",
        "完成或开始首次入金",
        "完成或开始首次出金测试",
      ],

      note:
        "标准目标是在第一次线上咨询中尽可能完成完整操作闭环。",
    },

    {
      id:
        "service-boundary",

      section:
        "intro",

      number:
        2,

      eyebrow:
        "SECURITY",

      title:
        "服务边界与账户安全",

      shortTitle:
        "安全边界",

      summary:
        "咨询人员只讲解流程，客户始终自行控制账户、资金和投资决定。",

      bullets: [
        "不代客户登录 Cetesdirecto",
        "不索取账户密码、OTP、Token 或银行验证码",
        "不接触或保管客户投资资金",
        "不替客户输入 e.firma 私钥密码",
        "不推荐具体投资产品、期限、金额或买入时点",
        "所有最终操作均由客户本人确认并执行",
      ],

      note:
        null,
    },

    {
      id:
        "government-debt",

      section:
        "products",

      number:
        3,

      eyebrow:
        "PRODUCTS",

      title:
        "墨西哥政府债务工具",

      shortTitle:
        "政府债务工具",

      summary:
        "先建立整体概念，再分别理解 CETES、BONOS 与 BONDDIA。",

      bullets: [
        "不同产品的期限与收益方式不同",
        "部分政府证券通过一级市场拍卖发行",
        "不同工具的流动性和价格表现不同",
      ],

      note:
        "正式课件内容后续会按 Banco de México 与 Cetesdirecto 官方资料逐页完善。",
    },

    {
      id:
        "cetes",

      section:
        "products",

      number:
        4,

      eyebrow:
        "CETES",

      title:
        "CETES 是什么？",

      shortTitle:
        "CETES",

      summary:
        "短期墨西哥政府证券。",

      bullets: [
        "常见期限与到期方式",
        "折价购买与收益来源",
        "Cetesdirecto 中的基本操作方式",
      ],

      note:
        null,
    },

    {
      id:
        "bonos",

      section:
        "products",

      number:
        5,

      eyebrow:
        "BONOS",

      title:
        "BONOS 是什么？",

      shortTitle:
        "BONOS",

      summary:
        "用于理解中长期固定利率政府债券。",

      bullets: [
        "期限通常长于 CETES",
        "利息与票息概念",
        "市场价格可能随利率环境变化",
      ],

      note:
        null,
    },

    {
      id:
        "bonddia",

      section:
        "products",

      number:
        6,

      eyebrow:
        "BONDDIA",

      title:
        "BONDDIA 为什么不一样？",

      shortTitle:
        "BONDDIA",

      summary:
        "BONDDIA 与直接持有 CETES 或 BONOS 的逻辑不同。",

      bullets: [
        "属于每日流动性的债务投资工具",
        "资金使用方式与等待政府证券拍卖不同",
        "适合理解 Cetesdirecto 中未投入其他证券资金的运作逻辑",
      ],

      note:
        null,
    },

    {
      id:
        "auction",

      section:
        "products",

      number:
        7,

      eyebrow:
        "SUBASTA",

      title:
        "哪些产品需要等待政府证券拍卖？",

      shortTitle:
        "拍卖机制",

      summary:
        "区分政府证券一级市场拍卖与非拍卖型资金操作。",

      bullets: [
        "CETES、BONOS 等政府证券发行与拍卖日历相关",
        "Cetesdirecto 客户并不是自己直接向 Banco de México 报价",
        "购买价格与对应拍卖结果有关",
        "BONDDIA 不需要等待同样的政府证券拍卖流程",
      ],

      note:
        null,
    },

    {
      id:
        "auction-allocation",

      section:
        "products",

      number:
        8,

      eyebrow:
        "SUBASTA",

      title:
        "提交购买指令后是不是一定买得到？",

      shortTitle:
        "购买指令",

      summary:
        "客户需要理解提交指令、拍卖结果与最终执行之间的关系。",

      bullets: [
        "Cetesdirecto 普通用户不自行提交竞标收益率",
        "最终执行与对应政府证券拍卖结果有关",
        "不把“已提交购买指令”理解为平台对结果作绝对保证",
      ],

      note:
        "正式措辞将在课件制作阶段继续按官方规则确认。",
    },

    {
      id:
        "risks",

      section:
        "risk",

      number:
        9,

      eyebrow:
        "RISK",

      title:
        "开始操作前先理解风险",

      shortTitle:
        "主要风险",

      summary:
        "政府证券并不代表不存在投资和操作风险。",

      bullets: [
        "MXN 汇率风险",
        "利率与市场价格风险",
        "流动性风险",
        "税务规则变化",
        "账户、银行与操作风险",
        "Cetesdirecto 或相关规则变化",
      ],

      note:
        null,
    },

    {
      id:
        "cetesdirecto",

      section:
        "account",

      number:
        10,

      eyebrow:
        "ACCOUNT",

      title:
        "Cetesdirecto 是什么？",

      shortTitle:
        "Cetesdirecto",

      summary:
        "理解平台、客户账户与资金之间的关系。",

      bullets: [
        "账户属于客户本人",
        "客户本人管理登录与安全凭证",
        "咨询服务不成为客户资金或账户的中间人",
      ],

      note:
        null,
    },

    {
      id:
        "account-levels",

      section:
        "account",

      number:
        11,

      eyebrow:
        "ACCOUNT LEVEL",

      title:
        "Cetesdirecto 不同账户等级是什么意思？",

      shortTitle:
        "账户等级",

      summary:
        "账户等级会影响资金操作能力与适用要求。",

      bullets: [
        "理解 Contrato Exprés / 基础账户能力",
        "理解较高账户能力对应的要求",
        "判断是否有必要进行账户升级",
      ],

      note:
        "具体 Nivel、额度与官方要求会在正式课件中按最新规则确认。",
    },

    {
      id:
        "efirma",

      section:
        "account",

      number:
        12,

      eyebrow:
        "E.FIRMA",

      title:
        "为什么要做 e.firma 绑定与账户升级？",

      shortTitle:
        "e.firma 升级",

      summary:
        "对于希望使用更高资金规模的客户，e.firma 是重要的账户升级工具。",

      bullets: [
        "理解为什么基础账户存在资金操作限制",
        "了解通过 e.firma 提升账户能力的作用",
        "客户本人完成 e.firma 操作",
        "私钥、.key 文件与密码绝不交给咨询人员",
      ],

      note:
        null,
    },

    {
      id:
        "requirements",

      section:
        "operation",

      number:
        13,

      eyebrow:
        "PREPARATION",

      title:
        "开户前准备",

      shortTitle:
        "开户准备",

      summary:
        "开始实际操作前确认必要条件。",

      bullets: [
        "身份与居留条件",
        "RFC / CURP",
        "本人墨西哥银行账户",
        "有效 CLABE",
        "如计划升级账户，确认 e.firma 状态",
      ],

      note:
        null,
    },

    {
      id:
        "opening",

      section:
        "operation",

      number:
        14,

      eyebrow:
        "OPEN ACCOUNT",

      title:
        "开始实际开户",

      shortTitle:
        "实际开户",

      summary:
        "从这里开始由客户本人共享屏幕并实际操作。",

      bullets: [
        "客户本人进入官方 Cetesdirecto",
        "咨询人员说明每一步的作用",
        "客户本人填写并确认个人信息",
        "遇到重要步骤时先解释，再由客户决定是否继续",
      ],

      note:
        null,
    },

    {
      id:
        "clabe",

      section:
        "operation",

      number:
        15,

      eyebrow:
        "BANK",

      title:
        "银行账户与 CLABE",

      shortTitle:
        "CLABE",

      summary:
        "正确理解 Cetesdirecto 与本人银行账户的绑定关系。",

      bullets: [
        "使用本人名下的墨西哥银行账户",
        "确认 CLABE 信息",
        "注意姓名与账户信息的一致性",
        "银行密码和验证码由客户本人输入",
      ],

      note:
        null,
    },

    {
      id:
        "deposit",

      section:
        "operation",

      number:
        16,

      eyebrow:
        "DEPOSIT",

      title:
        "首次入金",

      shortTitle:
        "首次入金",

      summary:
        "客户本人完成第一次资金转入并确认到账状态。",

      bullets: [
        "确认正确的资金转入方式",
        "客户自行决定转入金额",
        "由客户本人操作银行账户",
        "确认 Cetesdirecto 中资金状态",
      ],

      note:
        null,
    },

    {
      id:
        "purchase",

      section:
        "operation",

      number:
        17,

      eyebrow:
        "OPERATION",

      title:
        "购买界面与操作流程",

      shortTitle:
        "购买流程",

      summary:
        "只说明界面和操作逻辑，不替客户做投资决定。",

      bullets: [
        "认识可用产品与期限显示",
        "理解购买指令与拍卖时间",
        "了解确认操作的步骤",
        "不建议具体产品、金额或买入时机",
      ],

      note:
        null,
    },

    {
      id:
        "tax",

      section:
        "tax",

      number:
        18,

      eyebrow:
        "TAX",

      title:
        "税务处理与预扣机制",

      shortTitle:
        "税务处理",

      summary:
        "理解 Cetesdirecto 投资收益可能涉及的税务处理。",

      bullets: [
        "理解预扣税的基本概念",
        "了解平台税务资料与客户税务身份之间的关系",
        "了解年度税务文件与申报注意事项",
        "实际适用税率和申报义务以当年官方规则为准",
      ],

      note:
        "正式内容将在课件制作阶段按 SAT 与 Cetesdirecto 最新规则核实。",
    },

    {
      id:
        "withdrawal",

      section:
        "operation",

      number:
        19,

      eyebrow:
        "WITHDRAWAL",

      title:
        "首次出金测试",

      shortTitle:
        "首次出金",

      summary:
        "完成一次基础出金测试，确认客户理解资金退出流程。",

      bullets: [
        "客户本人选择出金金额",
        "确认目标银行账户",
        "由客户本人完成所有安全验证",
        "确认基本资金进出流程已经掌握",
      ],

      note:
        null,
    },

    {
      id:
        "closing",

      section:
        "closing",

      number:
        20,

      eyebrow:
        "COMPLETE",

      title:
        "完成第一次咨询闭环",

      shortTitle:
        "咨询完成",

      summary:
        "确认今天已经完成的操作，以及仍需跟进的事项。",

      bullets: [
        "Cetesdirecto 开户状态",
        "账户等级 / e.firma 升级状态",
        "首次入金状态",
        "首次出金测试状态",
        "如有外部处理等待事项，进入订单 Workspace 跟进",
      ],

      note:
        "账户升级不是服务完成的强制 Milestone；核心 Milestone 仍为开户、首次入金、首次出金测试。",
    },
  ];