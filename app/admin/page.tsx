import Link from "next/link";

export default function AdminPage() {
  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold">
          管理控制台
        </h1>

        <p className="mt-2 text-gray-500">
          管理订单、服务与支付状态。
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <Link
          href="/admin/orders"
          className="
            rounded-xl
            border
            bg-white
            p-6
            transition
            hover:shadow-md
          "
        >
          <p className="text-sm text-gray-500">
            订单
          </p>

          <h2 className="mt-2 text-xl font-semibold">
            订单管理
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            查看与处理客户订单。
          </p>
        </Link>

        <Link
          href="/admin/services"
          className="
            rounded-xl
            border
            bg-white
            p-6
            transition
            hover:shadow-md
          "
        >
          <p className="text-sm text-gray-500">
            服务
          </p>

          <h2 className="mt-2 text-xl font-semibold">
            服务管理
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            管理服务与申请表单。
          </p>
        </Link>

        <Link
          href="/admin/payments/reconciliation"
          className="
            rounded-xl
            border
            bg-white
            p-6
            transition
            hover:shadow-md
          "
        >
          <p className="text-sm text-gray-500">
            支付
          </p>

          <h2 className="mt-2 text-xl font-semibold">
            支付对账
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            检查支付状态与异常订单。
          </p>
        </Link>
      </div>
    </div>
  );
}