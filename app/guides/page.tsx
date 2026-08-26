import type {
    Metadata,
  } from "next";
  
  import Link from "next/link";
  
  import PublicShell from "@/components/layout/PublicShell";
  
  import {
    guides,
  } from "@/lib/guides/guides";
  
  
  export const metadata:
    Metadata = {
      title:
        "墨西哥办事指南｜RFC、e.firma、SAT、CETES 中文说明",
  
      description:
        "面向中国用户整理墨西哥 RFC、e.firma、SAT、CETES、Cetesdirecto 等常见办事与投资平台操作知识。",
  
      alternates: {
        canonical:
          "/guides",
      },
  
      openGraph: {
        type:
          "website",
  
        url:
          "/guides",
  
        title:
          "墨西哥办事指南｜Lativia",
  
        description:
          "为中国用户整理墨西哥官方手续、SAT 税务流程和 Cetesdirecto 中文指南。",
      },
    };
  
  
  export default function GuidesPage() {
    return (
      <PublicShell>
        <main className="bg-slate-50">
          <section className="border-b border-slate-200 bg-white">
            <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
              <p className="text-sm font-bold text-blue-700">
                墨西哥办事指南
              </p>
  
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                给中国用户的墨西哥实用指南
              </h1>
  
              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
                整理 RFC、e.firma、SAT、CETES、
                Cetesdirecto 等常见问题。
                内容以理解流程和准备资料为主，
                具体要求请以主管机关当前规则为准。
              </p>
            </div>
          </section>
  
  
          <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="grid gap-5 md:grid-cols-2">
              {guides.map(
                guide => (
                  <Link
                    key={
                      guide.slug
                    }
                    href={
                      `/guides/${guide.slug}`
                    }
                    className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                  >
                    <p className="text-xs font-bold uppercase tracking-wide text-blue-700">
                      {
                        guide.category
                      }
                    </p>
  
                    <h2 className="mt-3 text-xl font-bold leading-8 text-slate-950 group-hover:text-blue-700">
                      {
                        guide.title
                      }
                    </h2>
  
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {
                        guide.description
                      }
                    </p>
  
                    <p className="mt-5 text-sm font-semibold text-blue-700">
                      阅读指南 →
                    </p>
                  </Link>
                )
              )}
            </div>
          </section>
        </main>
      </PublicShell>
    );
  }