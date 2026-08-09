import { redirect } from "next/navigation";
import { getCurrentProfile } from "./getCurrentProfile";

export async function requireAdmin() {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/auth/login");
  }

  if (profile.role !== "admin") {
    redirect("/");
  }

  return profile;
}