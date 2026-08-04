import { services } from "@/data/services";
import { notFound } from "next/navigation";
import ServiceInfo from "@/components/service/ServiceInfo";
import RequirementList from "@/components/service/RequirementList";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;

  const service = services.find(
    (item) => item.slug === slug
  );

  if (!service) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="text-4xl font-bold">
        {service.title}
      </h1>

      <p className="mt-4">
        {service.description}
      </p>

      <ServiceInfo price={service.price} duration={service.duration} />

      <RequirementList requirements={service.requirements ?? []}
/>
    </main>
  );
}