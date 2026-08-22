interface Props {
  requirements:
    string[];
}


export default function RequirementList({
  requirements,
}: Props) {
  if (
    requirements.length ===
    0
  ) {
    return null;
  }


  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 3h9l3 3v15H6z" />

            <path d="M15 3v4h4" />

            <path d="m9 13 2 2 4-4" />
          </svg>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-950">
            办理前准备
          </h2>

          <p className="mt-0.5 text-xs text-slate-500">
            提交申请前，请确认已具备以下资料。
          </p>
        </div>
      </div>


      <ul className="mt-5 grid gap-2 sm:grid-cols-2">
        {requirements.map(
          item => (
            <li
              key={
                item
              }
              className="flex items-start gap-2.5 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                <svg
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 12 4 4 8-8" />
                </svg>
              </span>

              <span>
                {
                  item
                }
              </span>
            </li>
          )
        )}
      </ul>
    </section>
  );
}