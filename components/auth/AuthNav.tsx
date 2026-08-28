"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import type {
  User,
} from "@supabase/supabase-js";

import {
  createClient,
} from "@/lib/supabase/client";

import LogoutButton from "./LogoutButton";


type NavigationItem = {
  href: string;
  label: string;
};


type AuthNavProps = {
  mainNavigation?: NavigationItem[];
};


export default function AuthNav({
  mainNavigation = [],
}: AuthNavProps) {
  const [user, setUser] =
    useState<User | null>(
      null
    );

  const [
    menuOpen,
    setMenuOpen,
  ] =
    useState(
      false
    );

  const [
    unreadCount,
    setUnreadCount,
  ] =
    useState(
      0
    );

    const [
      isAdmin,
      setIsAdmin,
    ] =
      useState(
        false
      );


  useEffect(() => {
    const supabase =
      createClient();

    let activeUser:
      User | null =
      null;


    async function loadUnreadCount(
      currentUser:
        User | null
    ) {
      if (
        !currentUser
      ) {
        setUnreadCount(
          0
        );

        return;
      }

      const {
        count,
        error,
      } =
        await supabase
          .from(
            "notifications"
          )
          .select(
            "id",
            {
              count:
                "exact",
              head:
                true,
            }
          )
          .eq(
            "user_id",
            currentUser.id
          )
          .eq(
            "status",
            "unread"
          );

      if (
        error
      ) {
        console.error(
          "读取未读通知数量失败:",
          error
        );

        return;
      }

      setUnreadCount(
        count ??
          0
      );
    }

    async function loadAdminStatus(
      currentUser:
        User | null
    ) {
      if (
        !currentUser
      ) {
        setIsAdmin(
          false
        );

        return;
      }


      const {
        data,
        error,
      } =
        await supabase
          .from(
            "profiles"
          )
          .select(
            "role"
          )
          .eq(
            "id",
            currentUser.id
          )
          .maybeSingle();


      if (
        error
      ) {
        console.error(
          "读取管理员身份失败:",
          error
        );

        setIsAdmin(
          false
        );

        return;
      }


      setIsAdmin(
        data?.role ===
          "admin"
      );
    }


    supabase.auth
      .getUser()
      .then(
        ({
          data,
        }) => {
          activeUser =
            data.user;

            setUser(
              activeUser
            );

            void loadUnreadCount(
              activeUser
            );

            void loadAdminStatus(
              activeUser
            );
        }
      );


    const {
      data: {
        subscription,
      },
    } =
      supabase.auth.onAuthStateChange(
        (
          _event,
          session
        ) => {
          activeUser =
            session?.user ??
            null;

            setUser(
              activeUser
            );

            void loadUnreadCount(
              activeUser
            );

            void loadAdminStatus(
              activeUser
            );
        }
      );


    function refreshUnreadCount() {
      void loadUnreadCount(
        activeUser
      );
    }


    function handleVisibilityChange() {
      if (
        document.visibilityState ===
        "visible"
      ) {
        refreshUnreadCount();
      }
    }


    window.addEventListener(
      "focus",
      refreshUnreadCount
    );

    window.addEventListener(
      "notifications:changed",
      refreshUnreadCount
    );

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );


    const interval =
      window.setInterval(
        refreshUnreadCount,
        60_000
      );


    return () => {
      subscription.unsubscribe();

      window.clearInterval(
        interval
      );

      window.removeEventListener(
        "focus",
        refreshUnreadCount
      );

      window.removeEventListener(
        "notifications:changed",
        refreshUnreadCount
      );

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, []);


  function closeMenu() {
    setMenuOpen(
      false
    );
  }


  const notificationBadge =
    unreadCount >
    0 ? (
      <span className="relative ml-1.5 inline-flex items-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-30" />

        <span className="relative inline-flex min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
          {unreadCount >
          99
            ? "99+"
            : unreadCount}
        </span>
      </span>
    ) : null;


  return (
    <>
      {/* Desktop / large tablet */}
      <div className="hidden items-center gap-2 lg:flex">
        {user ? (
          <>

            {isAdmin && (
              <Link
                href="/admin"
                prefetch={false}
                className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                管理后台
              </Link>
            )}
            <Link
              href="/account/orders"
              prefetch={false}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
            >
              我的订单
            </Link>

            <Link
              href="/account/notifications"
              prefetch={false}
              className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
            >
              通知

              {
                notificationBadge
              }
            </Link>

            <div className="ml-1 flex items-center gap-2 border-l border-slate-200 pl-3">
              <span className="max-w-36 truncate text-sm text-slate-500">
                {user.email ??
                  "我的账户"}
              </span>

              <LogoutButton />
            </div>
          </>
        ) : (
          <>
            <Link
              href="/auth/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
            >
              登录
            </Link>

            <Link
              href="/services"
              className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
            >
              开始办理
            </Link>
          </>
        )}
      </div>


      {/* Mobile / tablet */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() =>
            setMenuOpen(
              current =>
                !current
            )
          }
          aria-expanded={
            menuOpen
          }
          aria-label="打开导航菜单"
          className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
        >
          <span className="sr-only">
            导航菜单
          </span>

          <div className="space-y-1.5">
            <span className="block h-0.5 w-5 rounded-full bg-current" />
            <span className="block h-0.5 w-5 rounded-full bg-current" />
            <span className="block h-0.5 w-5 rounded-full bg-current" />
          </div>

          {unreadCount >
            0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-bold text-white">
              {unreadCount >
              9
                ? "9+"
                : unreadCount}
            </span>
          )}
        </button>


        {menuOpen && (
          <div className="absolute left-0 right-0 top-16 border-b border-slate-200 bg-white shadow-lg lg:hidden">
            <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
              <nav className="grid gap-1">
                {mainNavigation.map(
                  item => (
                    <Link
                      key={
                        item.href
                      }
                      href={
                        item.href
                      }
                      onClick={
                        closeMenu
                      }
                      className="rounded-xl px-4 py-3 text-base font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      {
                        item.label
                      }
                    </Link>
                  )
                )}
              </nav>


              <div className="my-4 border-t border-slate-200" />


              {user ? (
                <div className="grid gap-2">
                {isAdmin && (
                    <Link
                      href="/admin"
                      prefetch={false}
                      onClick={
                        closeMenu
                      }
                      className="rounded-xl bg-slate-900 px-4 py-3 text-base font-semibold text-white transition hover:bg-slate-800"
                    >
                      管理后台
                    </Link>
                  )}
                  <Link
                    href="/account/orders"
              prefetch={false}
                    onClick={
                      closeMenu
                    }
                    className="rounded-xl px-4 py-3 text-base font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    我的订单
                  </Link>

                  <Link
                    href="/account/notifications"
              prefetch={false}
                    onClick={
                      closeMenu
                    }
                    className="flex items-center rounded-xl px-4 py-3 text-base font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    通知

                    {
                      notificationBadge
                    }
                  </Link>

                  <div className="mt-2 rounded-xl bg-slate-50 p-4">
                    <p className="truncate text-sm text-slate-500">
                      {user.email ??
                        "我的账户"}
                    </p>

                    <div className="mt-3">
                      <LogoutButton />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid gap-2 sm:grid-cols-2">
                  <Link
                    href="/auth/login"
                    onClick={
                      closeMenu
                    }
                    className="flex min-h-12 items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-base font-semibold text-slate-700"
                  >
                    登录
                  </Link>

                  <Link
                    href="/services"
                    onClick={
                      closeMenu
                    }
                    className="flex min-h-12 items-center justify-center rounded-xl bg-blue-700 px-4 py-3 text-base font-semibold text-white"
                  >
                    开始办理
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
