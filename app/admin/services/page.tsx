import { getServices } from "@/lib/services/getServices";
import ServiceRow from "@/components/admin/ServiceRow";

export default async function AdminServicesPage() {
  const services = await getServices();

  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="mb-8 text-3xl font-bold">
        服务管理
      </h1>

      <div className="space-y-4">
        {services.map((service) => (
          <ServiceRow
            key={service.id}
            service={service}
          />
        ))}
      </div>
    </main>
  );
}