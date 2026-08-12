import {
  createClient,
} from "@/lib/supabase/server";

import type {
  Service,
} from "@/types/service";

import {
  normalizeService,
} from "./mapper";

export async function getServiceById(
  id: string
): Promise<Service | null> {
  const supabase =
    await createClient();

  const {
    data,
    error,
  } = await supabase
    .from("services")
    .select("*")
    .eq(
      "id",
      id
    )
    .maybeSingle();

  if (error) {
    console.error(
      "getServiceById error:",
      error
    );

    return null;
  }

  if (!data) {
    return null;
  }

  return normalizeService(
    data
  );
}