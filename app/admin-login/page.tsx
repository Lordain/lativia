import type {
  Metadata,
} from "next";

import {
    redirect,
  } from "next/navigation";
  
  import AdminLoginForm from "@/components/admin/AdminLoginForm";
  
  import {
    createClient,
  } from "@/lib/supabase/server";
  
  import {
    createAdminClient,
  } from "@/lib/supabase/admin";
  
  import {
    brandConfig,
  } from "@/lib/brand/brandConfig";
  
export const metadata:
  Metadata = {
    robots: {
      index:
        false,

      follow:
        false,

      googleBot: {
        index:
          false,

        follow:
          false,
      },
    },
  };


  export default async function AdminLoginPage() {
    /*
     * If a valid Admin session already exists,
     * do not display the login page again.
     */
  
    const supabase =
      await createClient();
  
  
    const {
      data: {
        user,
      },
    } =
      await supabase
        .auth
        .getUser();
  
  
    if (
      user
    ) {
      const admin =
        createAdminClient();
  
  
      const {
        data:
          profile,
      } =
        await admin
          .from(
            "profiles"
          )
          .select(`
            role
          `)
          .eq(
            "id",
            user.id
          )
          .maybeSingle();
  
  
      if (
        profile?.role ===
          "admin"
      ) {
        redirect(
          "/admin"
        );
      }
    }
  
  
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/60 sm:p-9">
            <div className="mb-8">
              {brandConfig.logoUrl ? (
                  <img
                    src={
                      brandConfig.logoUrl
                    }
                    alt={
                      brandConfig.name
                    }
                    className="h-7 w-auto max-w-[150px] object-contain"
                  />
                ) : (
                  <p className="text-lg font-semibold tracking-tight text-slate-950">
                    {
                      brandConfig.name
                    }
                  </p>
                )}

                <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
                  管理后台
                </h1>
  
              <p className="mt-2 text-sm leading-6 text-slate-500">
                使用管理员用户名和密码登录。
              </p>
            </div>
  
            <AdminLoginForm />
  
            <div className="mt-7 border-t border-slate-100 pt-5">
              <p className="text-xs leading-5 text-slate-400">
                此入口仅供授权的 Lativia 管理人员使用。
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }