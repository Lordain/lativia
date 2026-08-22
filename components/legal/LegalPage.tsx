import Link from "next/link";


interface LegalSection {
  id:
    string;

  title:
    string;

  content:
    React.ReactNode;
}


interface Props {
  eyebrow:
    string;

  title:
    string;

  description:
    string;

  updatedAt:
    string;

  sections:
    LegalSection[];
}


export default function LegalPage({
  eyebrow,
  title,
  description,
  updatedAt,
  sections,
}: Props) {
  return (
    <main className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
          <p className="text-sm font-bold text-blue-700">
            {
              eyebrow
            }
          </p>

          <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            {
              title
            }
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
            {
              description
            }
          </p>

          <p className="mt-5 text-xs text-slate-400">
            最后更新：
            {
              updatedAt
            }
          </p>
        </div>
      </section>


      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:px-8">
        <aside>
          <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="px-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
              页面目录
            </p>

            <nav className="mt-3 space-y-1">
              {sections.map(
                section => (
                  <a
                    key={
                      section.id
                    }
                    href={
                      `#${section.id}`
                    }
                    className="block rounded-lg px-2 py-2 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-blue-700"
                  >
                    {
                      section.title
                    }
                  </a>
                )
              )}
            </nav>
          </div>
        </aside>


        <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {sections.map(
            (
              section,
              index
            ) => (
              <section
                key={
                  section.id
                }
                id={
                  section.id
                }
                className={
                  `scroll-mt-24 px-6 py-8 sm:px-8 ${
                    index > 0
                      ? "border-t border-slate-100"
                      : ""
                  }`
                }
              >
                <h2 className="text-xl font-bold text-slate-950">
                  {
                    section.title
                  }
                </h2>

                <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600">
                  {
                    section.content
                  }
                </div>
              </section>
            )
          )}


          <div className="border-t border-slate-100 bg-slate-50 px-6 py-6 sm:px-8">
            <p className="text-sm text-slate-600">
              对本页面内容有疑问？
            </p>

            <Link
              href="/help"
              className="mt-2 inline-flex font-bold text-blue-700 transition hover:text-blue-800"
            >
              前往帮助中心
              <span className="ml-2">
                →
              </span>
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}