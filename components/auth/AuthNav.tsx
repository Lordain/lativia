"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";
import LogoutButton from "./LogoutButton";

export default function AuthNav() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <Link
          href="/account"
          className="text-sm hover:underline"
        >
          我的账号
        </Link>

        <LogoutButton />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link
        href="/auth/login"
        className="text-sm hover:underline"
      >
        登录
      </Link>

      <Link
        href="/auth/register"
        className="rounded bg-blue-600 px-3 py-2 text-sm text-white"
      >
        注册
      </Link>
    </div>
  );
}