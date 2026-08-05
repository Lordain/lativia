import { supabase } from "@/lib/supabase";

export default async function TestPage() {
  const { data, error } = await supabase
    .from("services")
    .select("*");

  if (error) {
    return (
      <main className="p-10">
        <h1 className="text-2xl font-bold text-red-600">
          連線失敗
        </h1>

        <p className="mt-4">
          {error.message}
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl p-10">
      <h1 className="mb-8 text-3xl font-bold">
        🎉 Supabase 連線成功
      </h1>

      <pre className="rounded bg-gray-100 p-4 overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </main>
  );
}