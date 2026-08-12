import {
    notFound,
  } from "next/navigation";
  
  import {
    requireAdmin,
  } from "@/lib/auth/requireAdmin";
  
  import {
    getServiceById,
  } from "@/lib/services/getServiceById";
  
  import EditServiceContainer from "@/components/admin/EditServiceContainer";
  
  interface Props {
    params: Promise<{
      id: string;
    }>;
  }
  
  export default async function EditServicePage({
    params,
  }: Props) {
    await requireAdmin();
  
    const {
      id,
    } = await params;
  
    const service =
      await getServiceById(
        id
      );
  
    if (!service) {
      notFound();
    }
  
    return (
      <div className="mx-auto max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold">
            编辑服务
          </h1>
  
          <p className="mt-2 text-sm text-gray-500">
            Service ID：
            {service.id}
          </p>
        </div>
  
        <div className="mt-6 rounded-xl border bg-white p-6">
          <EditServiceContainer
            id={service.id}
            initialData={{
              slug:
                service.slug,
  
              title:
                service.title,
  
              shortDescription:
                service.shortDescription,
  
              description:
                service.description,
  
              category:
                service.category,
  
              icon:
                service.icon,
  
              price:
                service.price,
  
              duration:
                service.duration,
  
              requirements:
                service.requirements.join(
                  ", "
                ),
  
              popular:
                service.popular,
  
              isActive:
                service.isActive,
            }}
          />
        </div>
  
        <div className="mt-4 rounded-lg bg-gray-50 p-4 text-xs text-gray-500">
          当前服务的申请表单
          form_schema
          不会因为修改基本资料而被覆盖。
        </div>
      </div>
    );
  }