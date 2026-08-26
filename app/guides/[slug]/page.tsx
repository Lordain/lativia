import type {
    Metadata,
  } from "next";
  
  import Link from "next/link";
  
  import {
    notFound,
  } from "next/navigation";
  
  import PublicShell from "@/components/layout/PublicShell";
  
  import {
    getGuide,
    guides,
  } from "@/lib/guides/guides";
  
  
  interface Props {
    params:
      Promise<{
        slug:
          string;
      }>;
  }
  
  
  export function generateStaticParams() {
    return guides.map(
      guide => ({
        slug:
          guide.slug,
      })
    );
  }
  
  
  export async function generateMetadata({
    params,
  }: Props): Promise<Metadata> {
    const {
      slug,
    } =
      await params;
  
  
    const guide =
      getGuide(
        slug
      );
  
  
    if (!guide) {
      return {
        title:
          "找不到指南",
  
        robots: {
          index:
            false,
  
          follow:
            false,
        },
      };
    }
  
  
    const canonicalUrl =
      `/guides/${guide.slug}`;
  
  
    return {
      title:
        guide.title,
  
      description:
        guide.description,
  
      alternates: {
        canonical:
          canonicalUrl,
      },
  
      openGraph: {
        type:
          "article",
  
        url:
          canonicalUrl,
  
        title:
          guide.title,
  
        description:
          guide.description,
  
        siteName:
          "Lativia",
  
        locale:
          "zh_CN",
      },
  
      twitter: {
        card:
          "summary",
  
        title:
          guide.title,
  
        description:
          guide.description,
      },
    };
  }
  
  
  export default async function GuidePage({
    params,
  }: Props) {
    const {
      slug,
    } =
      await params;
  
  
    const guide =
      getGuide(
        slug
      );
  
  
    if (!guide) {
      notFound();
    }
  
  
    return (
      <PublicShell>
        <main className="bg-slate-50">
          <article className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
            <Link
              href="/guides"
              className="text-sm font-semibold text-blue-700 hover:text-blue-800"
            >
              ← 返回墨西哥办事指南
            </Link>
  
  
            <header className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-sm font-bold text-blue-700">
                {
                  guide.category
                }
              </p>
  
              <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl">
                {
                  guide.title
                }
              </h1>
  
              <p className="mt-5 text-base leading-8 text-slate-600">
                {
                  guide.description
                }
              </p>
  
              <div className="mt-5 border-t border-slate-100 pt-4 text-xs text-slate-500">
                更新：
                {
                  guide.updatedAt
                }
                <span className="mx-2">
                  ·
                </span>
                具体要求以主管机关当前规则为准
              </div>
            </header>
  
  
            <div className="mt-6 space-y-5">
              {guide.sections.map(
                section => (
                  <section
                    key={
                      section.heading
                    }
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7"
                  >
                    <h2 className="text-xl font-bold text-slate-950">
                      {
                        section.heading
                      }
                    </h2>
  
  
                    {section.paragraphs?.map(
                      paragraph => (
                        <p
                          key={
                            paragraph
                          }
                          className="mt-4 text-base leading-8 text-slate-700"
                        >
                          {
                            paragraph
                          }
                        </p>
                      )
                    )}
  
  
                    {section.items &&
                      section.items.length >
                        0 && (
                      <ul className="mt-4 space-y-3">
                        {section.items.map(
                          item => (
                            <li
                              key={
                                item
                              }
                              className="flex items-start gap-3 text-base leading-7 text-slate-700"
                            >
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
  
                              <span>
                                {
                                  item
                                }
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    )}
                  </section>
                )
              )}
            </div>
  
  
            {guide.relatedServiceSlug &&
              guide.relatedServiceLabel && (
              <section className="mt-7 rounded-2xl border border-blue-200 bg-blue-50 p-6 sm:p-7">
                <p className="text-sm font-bold text-blue-700">
                  需要办理协助？
                </p>
  
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  如果您已经了解基本流程，
                  但需要中文预约、资料准备或办理协助，
                  可以查看对应服务。
                </p>
  
                <Link
                  href={
                    `/services/${guide.relatedServiceSlug}`
                  }
                  className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800"
                >
                  {
                    guide.relatedServiceLabel
                  }
                </Link>
              </section>
            )}
  
  
            <section className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <p className="text-sm leading-7 text-amber-900">
                本文用于中文流程说明和一般信息整理，
                不替代 SAT、Cetesdirecto 或其他主管机关的正式规定。
                涉及税务或投资决定时，请根据个人情况自行判断或咨询相应专业人士。
              </p>
            </section>
          </article>
        </main>
      </PublicShell>
    );
  }