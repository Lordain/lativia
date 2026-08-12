import {
  supabase,
} from "@/lib/supabase";

import type {
  Service,
} from "@/types/service";

import {
  normalizeService,
} from "./mapper";

export async function getService(
  slug: string
): Promise<Service | null> {
  const {
    data,
    error,
  } = await supabase
    .from("services")
    .select("*")
    .eq(
      "slug",
      slug
    )
    .eq(
      "is_active",
      true
    )
    .maybeSingle();

  if (
    error ||
    !data
  ) {
    return null;
  }

  return normalizeService(
    data
  );
}