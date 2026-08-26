import Link from "next/link";

import AuthNav from "@/components/auth/AuthNav";

import {
  brandConfig,
} from "@/lib/brand/brandConfig";


const mainNavigation = [
  {
    href: "/",
    label: "首页",
  },
  {
    href: "/services/cetesdirecto-consultation",
    label: "墨西哥国债咨询",
  },
  {
    href: "/services",
    label: "办事服务",
  },
  {
    href: "/help",
    label: "帮助中心",
  },
];


export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:h-[72px] lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          className="flex shrink-0 items-center"
          aria-label={`${brandConfig.name} 首页`}
        >
          {brandConfig.logoUrl ? (
            <img
              src={
                brandConfig.logoUrl
              }
              alt={
                brandConfig.name
              }
              className="h-8 w-auto max-w-[150px] object-contain sm:h-9 sm:max-w-[170px]"
            />
          ) : (
            <span className="text-[22px] font-bold tracking-tight text-slate-950 transition hover:text-blue-700 sm:text-2xl">
              {
                brandConfig.name
              }
            </span>
          )}
        </Link>


        {/* Desktop / large tablet navigation */}
        <nav className="ml-8 hidden items-center gap-1 lg:flex xl:ml-12">
          {mainNavigation.map(
            (item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-950 xl:px-4"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>


        {/* Auth / account navigation */}
        <div className="ml-auto">
          <AuthNav
            mainNavigation={
              mainNavigation
            }
          />
        </div>
      </div>
    </header>
  );
}