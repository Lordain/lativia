import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="mx-auto max-w-xl p-10">
      <h1 className="mb-2 text-3xl font-bold">
        创建账号
      </h1>

      <p className="mb-8 text-gray-500">
        注册后即可提交办理申请并查看服务进度。
      </p>

      <RegisterForm />
    </main>
  );
}