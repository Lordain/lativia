interface ServiceSeoConfig {
  title: string;
  description: string;
}


const SERVICE_SEO:
  Record<
    string,
    ServiceSeoConfig
  > = {
    "individual-rfc-first-registration": {
      title:
        "墨西哥个人 RFC 首次申请｜SAT 预约与办理协助",

      description:
        "第一次申请墨西哥个人 RFC？Lativia 提供 SAT 预约协助，可选择预约或预约加现场陪同，办理前先确认服务范围和所需准备。",
    },

    "individual-efirma-first-registration": {
      title:
        "墨西哥个人 e.firma 首次申请｜SAT 预约与办理协助",

      description:
        "首次办理墨西哥 SAT e.firma，可选择预约协助或预约加现场办理陪同。页面说明办理范围、准备事项及 Lativia 可以协助的环节。",
    },

    "cetesdirecto-consultation": {
      title:
        "Cetesdirecto 中文开户与操作咨询｜墨西哥国债",

      description:
        "面向中文用户的 Cetesdirecto 操作咨询，涵盖开户、本人银行账户设置、首次入金、e.firma 账户升级及首次出金等实际操作流程。",
    },
  };


export function getServiceSeo(
  slug: string
):
  ServiceSeoConfig | null {
  return (
    SERVICE_SEO[
      slug
    ] ??
    null
  );
}
