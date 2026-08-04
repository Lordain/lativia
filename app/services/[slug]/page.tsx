import { services } from "@/data/services";
import { notFound } from "next/navigation";

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

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-4">
            <p className="text-sm text-gray-500">費用</p>
            <p className="text-xl font-bold">
                {service.price}
            </p>
        </div>

        <div className="rounded-lg border p-4">
            <p className="text-sm text-gray-500">辦理時間</p>
            <p className="text-xl font-bold">
                {service.duration}
            </p>
        </div>
    </div>

      <h2 className="mt-10 text-2xl font-bold">📄 需要準備文件</h2>

      <ul className="mt-4 space-y-2">
        {service.requirements?.map((requirement) => (
          <li key={requirement} className="rounded-md bg-gray-100 p-3">✅ {requirement}</li>
        ))}
      </ul>
    </main>
  );
}