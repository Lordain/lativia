"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth/signOut";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    try {
      await signOut();
  
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-gray-600 hover:text-black"
    >
      登出
    </button>
  );
}