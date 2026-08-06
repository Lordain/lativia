import { getServiceById } from "@/lib/services/getServiceById";
import { notFound } from "next/navigation";
import ServiceForm from "@/components/admin/ServiceForm";
import { updateService } from "@/lib/services/updateService";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function EditServicePage({ params }: Props) {
    
    
    const { id } = await params;
    const service = await getServiceById(id);

    if (!service) {
        notFound();
    }
    
    return (
        <main className="mx-auto max-w-4xl p-8">
            <h1 className="text-3xl font-bold">编辑服务</h1>
            <p className="text-sm text-gray-500">当前Service ID:</p>
            <div className="mt-8 rounded-lg border p-6">

            <ServiceForm initialData={{
                title: service.title,
                shortDescription: service.shortDescription,
                description: service.description,
                price: service.price,
                duration: service.duration,
                requirements: service.requirements.join(","),
            }} onSubmit={(data) => updateService(id, data)} />

            </div>
        </main>
    );
}