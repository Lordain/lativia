import {
    supabase,
  } from "@/lib/supabase";
  
  import {
    normalizeService,
  } from "./mapper";
  
  export async function getServices() {
    const {
      data,
      error,
    } = await supabase
      .from("services")
      .select("*")
      .neq(
        "service_status",
        "hidden"
      )
      .order(
        "popular",
        {
          ascending:
            false,
        }
      )
      .order("title");
  
    if (error) {
      throw new Error(
        error.message
      );
    }
  
    return (
      data ?? []
    ).map(
      normalizeService
    );
  }