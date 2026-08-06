import CreateServiceContainer from "@/components/admin/CreateServiceContainer";

export default function NewServicePage() {
    return (
        <main className="mx-auto max-w-3xl p-10">
            <h1 className="text-3xl font-bold">
                新增办理服务
            </h1>
            <CreateServiceContainer />
        </main>
    );
}