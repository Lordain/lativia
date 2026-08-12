import {
    createClient,
  } from "@/lib/supabase/server";
  
  import {
    normalizeService,
  } from "./mapper";
  
  export async function getAdminServices() {
    const supabase =
      await createClient();
  
    const {
      data,
      error,
    } = await supabase
      .from("services")
      .select("*")
      .order(
        "created_at",
        {
          ascending:
            false,
        }
      );
  
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