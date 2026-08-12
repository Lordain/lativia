import {
    requireAdmin,
  } from "@/lib/auth/requireAdmin";
  
  import {
    createAdminClient,
  } from "@/lib/supabase/admin";
  
  export interface OrderActivityItem {
    id: string;
  
    order_id:
      string;
  
    actor_user_id:
      string | null;
  
    action:
      string;
  
    from_status:
      string | null;
  
    to_status:
      string | null;
  
    note:
      string | null;
  
    created_at:
      string;
  }
  
  export async function getOrderActivity(
    orderId: string
  ): Promise<
    OrderActivityItem[]
  > {
    await requireAdmin();
  
    const supabase =
      createAdminClient();
  
    const {
      data,
      error,
    } = await supabase
      .from(
        "order_activity"
      )
      .select(`
        id,
        order_id,
        actor_user_id,
        action,
        from_status,
        to_status,
        note,
        created_at
      `)
      .eq(
        "order_id",
        orderId
      )
      .order(
        "created_at",
        {
          ascending:
            false,
        }
      );
  
    if (error) {
      console.error(
        "getOrderActivity error:",
        error
      );
  
      throw new Error(
        error.message
      );
    }
  
    return (
      data ?? []
    ) as OrderActivityItem[];
  }