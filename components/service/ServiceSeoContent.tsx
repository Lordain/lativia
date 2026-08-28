interface Props {
  slug: string;
}


interface ContentBlock {
  title: string;
  paragraphs: string[];
}


const CONTENT:
  Record<
    string,
    ContentBlock
  > = {
    "individual-rfc-first-registration": {
      title:
        "第一次申请个人 RFC，这项服务具体帮什么？",

      paragraphs: [
        "这项服务针对第一次办理个人 RFC 的用户。您可以只选择 SAT 预约协助，也可以选择预约加现场办理陪同。",

        "我们会在办理前先确认您购买的是首次申请服务，而不是 RFC 查询、验证或其他税务事项，避免到了 SAT 才发现办理目标与预约事项不一致。",

        "如果选择现场陪同，服务重点是协助理解办理流程、现场沟通和翻译。RFC 最终是否签发以及 SAT 当天的具体要求，仍以税务机关实际处理结果为准。",
      ],
    },

    "individual-efirma-first-registration": {
      title:
        "第一次办理 e.firma，需要先分清什么？",

      paragraphs: [
        "这项服务面向首次申请个人 e.firma 的用户，可选择只协助 SAT 预约，也可以选择预约加现场办理陪同。",

        "e.firma 和 RFC 是不同的办理事项。如果您还没有完成个人 RFC，或希望 RFC 与 e.firma 在同一次 SAT 办理过程中处理，应先确认适合自己的服务方案。",

        "现场陪同主要解决流程理解、沟通和翻译问题。e.firma 的身份确认、签发以及最终办理结果由 SAT 决定，相关密钥和密码也应始终由本人保管。",
      ],
    },
  };


export default function ServiceSeoContent({
  slug,
}: Props) {
  const content =
    CONTENT[
      slug
    ];


  if (!content) {
    return null;
  }


  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-xl font-bold tracking-tight text-slate-950">
        {content.title}
      </h2>

      <div className="mt-4 space-y-3">
        {content.paragraphs.map(
          paragraph => (
            <p
              key={
                paragraph
              }
              className="text-sm leading-7 text-slate-600 sm:text-base"
            >
              {paragraph}
            </p>
          )
        )}
      </div>
    </section>
  );
}
