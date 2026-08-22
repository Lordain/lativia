interface Props {
  keyword:
    string;

  onChange:
    (
      value:
        string
    ) => void;
}


export default function SearchBar({
  keyword,
  onChange,
}: Props) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle
            cx="11"
            cy="11"
            r="7"
          />

          <path d="m20 20-4-4" />
        </svg>
      </div>

      <input
        type="search"
        placeholder="搜索服务，例如 RFC、CURP、e.firma..."
        value={
          keyword
        }
        onChange={
          event =>
            onChange(
              event.target.value
            )
        }
        className="min-h-14 w-full rounded-2xl border border-slate-200 bg-white py-3 pl-12 pr-5 text-base text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
      />
    </div>
  );
}