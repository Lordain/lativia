"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/client";
import LogoutButton from "./LogoutButton";

export default function AuthNav() {
  const [user, setUser] =
    useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();

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
        <Link href="/account/orders">
          我的申请
        </Link>

        <LogoutButton />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link href="/auth/login">
        登录
      </Link>

      <Link href="/auth/register">
        注册
      </Link>
    </div>
  );
}