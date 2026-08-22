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
          <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 md:py-10 lg:px-8">
        <div className="mb-8">
        <p className="text-sm font-medium text-blue-700">
            Account
          </p>
  
          <h1 className="mt-1 text-3xl font-bold">
            我的通知
          </h1>
  
          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
            查看付款确认、服务办理、
            需要补充的资料以及退款状态更新。
          </p>
        </div>
  
  
        <NotificationList
          notifications={
            notifications
          }
        />
      </main>
    </PublicShell>
  );
  }