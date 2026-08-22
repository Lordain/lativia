import Link from "next/link";


export default function ServiceHelpCard() {
  return (
    <section className="mt-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div>
        <p className="font-bold text-slate-950">
          对办理要求还有疑问？
        </p>

        <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
          可前往帮助中心查看服务说明、
          订单流程、付款与常见问题。
        </p>
      </div>


      <Link
        href="/help"
        className="inline-flex min-h-10 shrink-0 items-center font-bold text-blue-700 transition hover:text-blue-800"
      >
        前往帮助中心

        <span className="ml-2">
          →
        </span>
      </Link>
    </section>
  );
}