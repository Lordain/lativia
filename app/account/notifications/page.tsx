import {
  redirect,
} from "next/navigation";

import {
  createClient,
} from "@/lib/supabase/server";

import PublicShell from "@/components/layout/PublicShell";

import {
  getMyNotifications,
} from "@/lib/notifications/getMyNotifications";

import NotificationList from "@/components/orders/NotificationList";


export default async function NotificationsPage() {
  const supabase =
    await createClient();

  const {
    data: {
      user,
    },
  } =
    await supabase.auth.getUser();

  if (!user) {
    redirect(
      "/auth/login"
    );
  }

  const notifications =
    await getMyNotifications(
      100
    );

  return (
    <PublicShell>
      <main className="min-h-[60vh] bg-slate-50">
        <div className="mx-auto w-full max-w-4xl px-4 py-7 sm:px-6 md:py-9">
          <div className="mb-6">
            <p className="text-xs font-bold tracking-wide text-blue-700">
              ACCOUNT
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
              我的通知
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              查看付款、服务进度、
              待处理事项以及退款状态更新。
            </p>
          </div>

          <NotificationList
            notifications={
              notifications
            }
          />
        </div>
      </main>
    </PublicShell>
  );
}