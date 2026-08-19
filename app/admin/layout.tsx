import type {
  ReactNode,
} from "react";

import {
  requireAdmin,
} from "@/lib/auth/requireAdmin";

import AdminLayoutShell from "@/components/admin/AdminLayoutShell";


interface Props {
  children: ReactNode;
}


export default async function AdminLayout({
  children,
}: Props) {
  await requireAdmin();

  return (
    <AdminLayoutShell
      adminLabel="admin"
    >
      {children}
    </AdminLayoutShell>
  );
}