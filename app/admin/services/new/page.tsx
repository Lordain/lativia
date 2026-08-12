import {
    requireAdmin,
  } from "@/lib/auth/requireAdmin";
  
  import CreateServiceContainer from "@/components/admin/CreateServiceContainer";
  
  export default async function NewServicePage() {
    await requireAdmin();
  
    return (
      <div className="mx-auto max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold">
            新增服务
          </h1>
  
          <p className="mt-2 text-gray-500">
            建立新的前台办理服务。
          </p>
        </div>
  
        <div className="mt-6 rounded-xl border bg-white p-6">
          <CreateServiceContainer />
        </div>
      </div>
    );
  }