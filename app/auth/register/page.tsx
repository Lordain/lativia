import Link from "next/link";

import RegisterForm from "@/components/auth/RegisterForm";
import {
  brandConfig,
} from "@/lib/brand/brandConfig";


export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto grid min-h-screen max-w-6xl lg:grid-cols-[0.95fr_1.05fr]">
        {/* Brand panel */}
        <section className="hidden bg-slate-950 px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <Link
              href="/"
              className="text-xl font-bold tracking-tight text-white"
            >
              {
                brandConfig.name
              }
            </Link>

            <div className="mt-20 max-w-md">
              <p className="text-xs font-bold tracking-[0.18em] text-blue-300">
                LATIVIA ACCOUNT
              </p>

              <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight">
                创建您的
                <br />
                Lativia 账户
              </h1>

              <p className="mt-5 text-sm leading-7 text-slate-300">
                一个账号即可管理您购买的服务、
                办理进度与后续通知。
              </p>
            </div>

            <div className="mt-10 space-y-3">
              {[
                "统一查看订单和服务状态",
                "接收办理进度与待处理事项",
                "个人账户与敏感凭证由您本人控制",
              ].map(
                item => (
                  <div
                    key={
                      item
                    }
                    className="flex items-start gap-3 text-sm text-slate-300"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-xs font-bold text-blue-300">
                      ✓
                    </span>

                    <span>
                      {
                        item
                      }
                    </span>
                  </div>
                )
              )}
            </div>
          </div>

          <p className="text-xs leading-5 text-slate-500">
            请勿在 Lativia 提交银行密码、
            OTP、Token、CVV 或 e.firma 私钥密码。
          </p>
        </section>


        {/* Form panel */}
        <section className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            <div className="lg:hidden">
              <Link
                href="/"
                className="text-lg font-bold tracking-tight text-slate-950"
              >
                {
                  brandConfig.name
                }
              </Link>
            </div>

            <div className="mt-8 lg:mt-0">
              <p className="text-xs font-bold tracking-wide text-blue-700">
                CREATE ACCOUNT
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
                创建账号
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                注册后即可提交服务申请并查看办理进度。
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <RegisterForm />
            </div>

            <p className="mt-5 text-center text-sm text-slate-500">
              已有账号？
              <Link
                href="/auth/login"
                className="ml-1 font-semibold text-blue-700 transition hover:text-blue-800"
              >
                登录
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}