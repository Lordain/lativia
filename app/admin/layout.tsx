import type {
    ReactNode,
  } from "react";
  
  import {
    redirect,
  } from "next/navigation";
  
  import AdminSidebar from "@/components/admin/AdminSidebar";
  import AdminHeader from "@/components/admin/AdminHeader";
  
  import {
    getCurrentProfile,
  } from "@/lib/auth/getCurrentProfile";
  
  interface Props {
    children: ReactNode;
  }
  
  export default async function AdminLayout({
    children,
  }: Props) {
    const profile =
      await getCurrentProfile();
  
    if (!profile) {
      redirect(
        "/auth/login"
      );
    }
  
    if (
      profile.role !==
      "admin"
    ) {
      redirect("/");
    }
  
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex min-h-screen">
          <AdminSidebar />
  
          <div className="flex min-w-0 flex-1 flex-col">
          <AdminHeader
              adminName={
                profile.name
              }
            />
  
            <main className="flex-1 p-8">
              {children}
            </main>
          </div>
        </div>
      </div>
    );
  }