import Link from "next/link";

import LoginMethodPanel from "@/components/auth/LoginMethodPanel";
import {
  brandConfig,
} from "@/lib/brand/brandConfig";


export default function LoginPage() {
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
                墨西哥的事，
                <br />
                用中文更好办。
              </h1>

              <p className="mt-5 text-sm leading-7 text-slate-300">
                登录后查看您的订单、
                办理进度、服务消息和通知。
              </p>
            </div>

            <div className="mt-10 space-y-3">
              {[
                "查看已购买服务和办理进度",
                "接收需要您处理的事项通知",
                "账户和敏感操作始终由您本人控制",
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
            您的登录凭证仅用于访问自己的
            Lativia 账户和订单。
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

            <div className="mt-10 lg:mt-0">
              <p className="text-xs font-bold tracking-wide text-blue-700">
                ACCOUNT LOGIN
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
                欢迎回来
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                登录后继续查看订单和服务进度。
              </p>
            </div>

            <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <LoginMethodPanel />
            </div>

            <p className="mt-5 text-center text-sm text-slate-500">
              还没有账号？
              <Link
                href="/auth/register"
                className="ml-1 font-semibold text-blue-700 transition hover:text-blue-800"
              >
                创建账号
              </Link>
            </p>

            <p className="mt-8 text-center text-xs leading-5 text-slate-400">
              登录即表示您正在访问自己的
              Lativia 账户。
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}