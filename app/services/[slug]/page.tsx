import { getService } from "@/lib/services/getService";
import { notFound } from "next/navigation";
import ServiceInfo from "@/components/service/ServiceInfo";
import RequirementList from "@/components/service/RequirementList";
import ContactButton from "@/components/service/ContactButton";
import { Metadata } from "next";
import DynamicForm from "@/components/forms/DynamicForm";
import { getServicePrices } from "@/lib/services/getServicePrices";

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

  const prices = await getServicePrices(service.id);

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

  const prices = await getServicePrices(service.id);

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

          <section className="mt-8 mb-12">
            <h2 className="text-xl font-semibold">
              付款方式
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              可选择墨西哥本地付款或微信人民币付款。
            </p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {prices.map((price) => (
                <div
                  key={price.id}
                  className="rounded-xl border border-gray-200 p-5"
                >
                  <p className="font-medium">
                    {price.currency === "MXN"
                      ? "墨西哥付款"
                      : "微信人民币付款"}
                  </p>

                  <p className="mt-2 text-2xl font-semibold">
                    {price.currency === "MXN"
                      ? `MXN $${Number(price.amount).toFixed(2)}`
                      : `CNY ¥${Number(price.amount).toFixed(2)}`}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <DynamicForm
            serviceId={service.id}
            schema={service.formSchema}
            prices={prices}
          />
        </section>
      )}


      <ContactButton serviceName={service.title}/>
    </main>
  );
}