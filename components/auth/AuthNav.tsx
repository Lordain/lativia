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
  ] = useState(false);


  useEffect(() => {
    const supabase =
      createClient();

    supabase.auth
      .getUser()
      .then(
        ({
          data,
        }) => {
          setUser(
            data.user
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
          setUser(
            session?.user ??
              null
          );
        }
      );

    return () => {
      subscription.unsubscribe();
    };
  }, []);


  function closeMenu() {
    setMenuOpen(false);
  }


  return (
    <>
      {/* Desktop / large tablet */}
      <div className="hidden items-center gap-2 lg:flex">
        {user ? (
          <>
            <Link
              href="/account/orders"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
            >
              我的订单
            </Link>

            <Link
              href="/account/notifications"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
            >
              通知
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
              (current) =>
                !current
            )
          }
          aria-expanded={
            menuOpen
          }
          aria-label="打开导航菜单"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
        >
          <span className="sr-only">
            导航菜单
          </span>

          <div className="space-y-1.5">
            <span className="block h-0.5 w-5 rounded-full bg-current" />
            <span className="block h-0.5 w-5 rounded-full bg-current" />
            <span className="block h-0.5 w-5 rounded-full bg-current" />
          </div>
        </button>


        {menuOpen && (
          <div className="absolute left-0 right-0 top-16 border-b border-slate-200 bg-white shadow-lg lg:hidden">
            <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
              <nav className="grid gap-1">
                {mainNavigation.map(
                  (
                    item
                  ) => (
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
                  <Link
                    href="/account/orders"
                    onClick={
                      closeMenu
                    }
                    className="rounded-xl px-4 py-3 text-base font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    我的订单
                  </Link>

                  <Link
                    href="/account/notifications"
                    onClick={
                      closeMenu
                    }
                    className="rounded-xl px-4 py-3 text-base font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    通知
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