import { getServices } from "@/lib/services/getServices";

export default async function AdminServicesPage() {
  const services = await getServices();

  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="mb-8 text-3xl font-bold">
        服务管理
      </h1>

      <div className="space-y-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <div>
              <h2 className="font-semibold">
                {service.title}
              </h2>

              <p className="text-sm text-gray-500">
                {service.shortDescription}
              </p>
            </div>

            <div className="flex gap-2">
              <button className="rounded bg-blue-500 px-4 py-2 text-white">
                编辑
              </button>

              <button className="rounded bg-red-500 px-4 py-2 text-white">
                删除
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}