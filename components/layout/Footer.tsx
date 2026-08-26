import Link from "next/link";

import {
  brandConfig,
} from "@/lib/brand/brandConfig";


export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center"
              aria-label={`${brandConfig.name} 首页`}
            >
              {brandConfig.footerLogoUrl ? (
                <img
                  src={
                    brandConfig.footerLogoUrl
                  }
                  alt={
                    brandConfig.name
                  }
                  className={`${brandConfig.logoDisplay.footerClassName} w-auto max-w-[190px] object-contain`}
                />
              ) : (
                <span className="text-2xl font-bold tracking-tight text-white">
                  {
                    brandConfig.name
                  }
                </span>
              )}
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
              面向中文用户的拉美办事与咨询服务平台，
              提供清晰、透明的服务流程与办理协助。
            </p>
          </div>

          {/* Services */}
          <div>
            <p className="text-sm font-semibold text-white">
              服务
            </p>

            <div className="mt-4 grid gap-3 text-sm">
              <Link
                href="/services/cetesdirecto-consultation"
                className="transition hover:text-white"
              >
                墨西哥国债咨询
              </Link>

              <Link
                href="/services"
                className="transition hover:text-white"
              >
                全部服务
              </Link>
            </div>
          </div>


          {/* Help */}
          <div>
            <p className="text-sm font-semibold text-white">
              帮助
            </p>

            <div className="mt-4 grid gap-3 text-sm">
              <Link
                href="/guides"
                className="transition hover:text-white"
              >
                办事指南
              </Link>

              <Link
                href="/help"
                className="transition hover:text-white"
              >
                帮助中心
              </Link>

              <Link
                href="/account/orders"
                className="transition hover:text-white"
              >
                我的订单
              </Link>
            </div>
          </div>


          {/* Legal */}
          <div>
            <p className="text-sm font-semibold text-white">
              法律与隐私
            </p>

            <div className="mt-4 grid gap-3 text-sm">
              <Link
                href="/terms"
                className="transition hover:text-white"
              >
                服务条款
              </Link>

              <Link
                href="/privacy"
                className="transition hover:text-white"
              >
                隐私政策
              </Link>

              <Link
                href="/refund-policy"
                className="transition hover:text-white"
              >
                退款政策
              </Link>

              <Link
                href="/data-processing"
                className="transition hover:text-white"
              >
                资料处理说明
              </Link>
            </div>
          </div>
        </div>


        <div className="mt-10 border-t border-slate-800 pt-6">
          <p className="text-xs leading-6 text-slate-500">
            Lativia
            为独立咨询与服务协助平台，
            并非墨西哥政府、SAT、
            CETESdirecto
            或其他政府机构官方网站。
          </p>

          <p className="mt-3 text-xs text-slate-500">
            © 2026 Lativia.
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}