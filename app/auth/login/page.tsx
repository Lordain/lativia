import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-xl p-10">
      <h1 className="mb-2 text-3xl font-bold">
        登录
      </h1>

      <p className="mb-8 text-gray-500">
        登录后即可提交服务申请并查看办理状态。
      </p>

      <LoginForm />

      <p className="mt-6 text-center text-sm text-gray-500">
        还没有账号？
        <Link
          href="/auth/register"
          className="ml-1 text-blue-600 hover:underline"
        >
          注册
        </Link>
      </p>
    </main>
  );
}