import { createClient } from "@/lib/supabase/client";
import type { OrderStatus } from "@/types/order";

export interface UpdateAdminOrderInput {
  status: OrderStatus;
  adminNote: string;
}

export async function updateAdminOrder(
  id: string,
  input: UpdateAdminOrderInput
) {
  const supabase = createClient();

  const { error } = await supabase
    .from("orders")
    .update({
      status: input.status,
      admin_note: input.adminNote,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}