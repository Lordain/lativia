import { getService } from "@/lib/services/getService";
import { notFound } from "next/navigation";
import ServiceInfo from "@/components/service/ServiceInfo";
import RequirementList from "@/components/service/RequirementList";
import ContactButton from "@/components/service/ContactButton";
import { Metadata } from "next";
import DynamicForm from "@/components/forms/DynamicForm";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;

  const service = await getService(slug);

  if (!service) {
    return {
      title: "找不到服务",
    };
  }

  return {
    title: `${service.title} 中文代办 | 墨西哥华人办事平台`,
    description: service.description,
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;

  const service = await getService(slug);

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

      <RequirementList requirements={service.requirements ?? []}/>

      {service.formSchema.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-6 text-2xl font-bold">
            开始办理
          </h2>

          <DynamicForm schema={service.formSchema} />
        </section>
      )}


      <ContactButton serviceName={service.title}/>
    </main>
  );
}