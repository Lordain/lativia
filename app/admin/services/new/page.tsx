import Link from "next/link";

import {
  requireAdmin,
} from "@/lib/auth/requireAdmin";

import CreateServiceContainer from "@/components/admin/CreateServiceContainer";

import AdminPageHeader from "@/components/admin/AdminPageHeader";


export default async function NewServicePage() {
  await requireAdmin();


  return (
    <div>
      <AdminPageHeader
        title="新增服务"
        description="建立新的前台服务，并配置客户申请资料、办理方式、交付规则与退款策略。"
        actions={
          <Link
            href="/admin/services"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-950"
          >
            ← 返回服务管理
          </Link>
        }
      />

      <div className="mt-8">
        <CreateServiceContainer />
      </div>
    </div>
  );
}
