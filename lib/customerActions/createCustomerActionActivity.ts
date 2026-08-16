import {
    createAdminClient,
  } from "@/lib/supabase/admin";
  
  import type {
    FulfillmentActorType,
  } from "@/types/fulfillment";
  
  
  interface CreateCustomerActionActivityInput {
    fulfillmentId:
      string;
  
    orderId:
      string;
  
    actorType:
      FulfillmentActorType;
  
    actorUserId?:
      string | null;
  
    action:
      string;
  
    message:
      string;
  
    metadata?:
      Record<
        string,
        unknown
      >;
  }
  
  
  export async function createCustomerActionActivity(
    input:
      CreateCustomerActionActivityInput
  ) {
    const admin =
      createAdminClient();
  
  
    const {
      error,
    } =
      await admin
        .from(
          "fulfillment_activity"
        )
        .insert({
          fulfillment_id:
            input.fulfillmentId,
  
          order_id:
            input.orderId,
  
          actor_type:
            input.actorType,
  
          actor_user_id:
            input.actorUserId ??
            null,
  
          action:
            input.action,
  
          from_status:
            null,
  
          to_status:
            null,
  
          message:
            input.message.trim() ||
            null,
  
          metadata:
            input.metadata ??
            {},
        });
  
  
    if (error) {
      console.error(
        "createCustomerActionActivity error:",
        {
          action:
            input.action,
  
          orderId:
            input.orderId,
  
          fulfillmentId:
            input.fulfillmentId,
  
          error,
        }
      );
  
  
      throw new Error(
        "记录客户资料修正活动失败"
      );
    }
  }