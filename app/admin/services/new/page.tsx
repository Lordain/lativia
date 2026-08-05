import ServiceForm from "@/components/admin/ServiceForm";

export default function NewServicePage() {
    return (
        <main className="mx-auto max-w-3xl p-10">
            <h1 className="text-3xl font-bold">
                新增服务
            </h1>

            <ServiceForm />
            
        </main>
    );
}