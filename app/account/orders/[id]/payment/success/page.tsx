import Link from "next/link";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function PaymentSuccessPage({
  params,
}: Props) {
  const { id } = await params;

  return (
    <main className="mx-auto max-w-xl p-8 text-center">
      <h1 className="text-3xl font-bold">
        付款流程已完成
      </h1>

      <p className="mt-4 text-gray-500">
        我們正在確認您的付款結果。
      </p>

      <Link
        href={`/account/orders/${id}`}
        className="mt-8 inline-block text-blue-600 hover:underline"
      >
        查看訂單
      </Link>
    </main>
  );
}