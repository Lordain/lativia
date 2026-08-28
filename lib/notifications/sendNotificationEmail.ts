import {
  createAdminClient,
} from "@/lib/supabase/admin";

import {
  sendEmail,
} from "@/lib/email/sendEmail";

import {
  renderNotificationEmail,
} from "@/lib/email/renderNotificationEmail";

import {
  resolveNotificationRecipient,
} from "@/lib/email/resolveNotificationRecipient";

import type {
  Notification,
} from "@/types/notification";


export async function sendNotificationEmail(
  notification:
    Notification
) {
  const admin =
    createAdminClient();


  /*
   * ========================================
   * 1. Resolve Recipient
   * ========================================
   */

  const recipient =
    await resolveNotificationRecipient({
      userId:
        notification.userId,
    });


  if (!recipient) {
    console.warn(
      "Email delivery skipped: recipient unavailable"
    );


    return null;
  }


  /*
   * ========================================
   * 2. Existing Delivery
   * ========================================
   */

  const {
    data:
      existingDelivery,

    error:
      existingError,
  } =
    await admin
      .from(
        "notification_deliveries"
      )
      .select(`
        id,
        status,
        attempt_count,
        recipient
      `)
      .eq(
        "notification_id",
        notification.id
      )
      .eq(
        "channel",
        "email"
      )
      .maybeSingle();


  if (
    existingError
  ) {
    console.error(
      "Email delivery lookup failed"
    );


    return null;
  }


  /*
   * Already sent = final.
   *
   * 永远不要因为重试再次发送。
   */

  if (
    existingDelivery
      ?.status ===
      "sent"
  ) {
    return {
      success:
        true,

      alreadySent:
        true,
    };
  }


  /*
   * ========================================
   * 3. Create Delivery if Missing
   * ========================================
   */

  let deliveryId:
    string;


  if (
    existingDelivery
  ) {
    deliveryId =
      existingDelivery.id;

  } else {
    const {
      data:
        createdDelivery,

      error:
        createError,
    } =
      await admin
        .from(
          "notification_deliveries"
        )
        .insert({
          notification_id:
            notification.id,

          channel:
            "email",

          provider:
            "resend",

          status:
            "pending",

          recipient,

          attempt_count:
            0,

          metadata: {
            source:
              "notification_email_engine",
          },
        })
        .select(
          "id"
        )
        .single();


    if (
      createError ||
      !createdDelivery
    ) {
      console.error(
        "Email delivery create failed"
      );


      return null;
    }


    deliveryId =
      createdDelivery.id;
  }


  /*
   * ========================================
   * 4. Mark Processing
   * ========================================
   */

  const currentAttempts =
    existingDelivery
      ?.attempt_count ??
    0;


  const now =
    new Date()
      .toISOString();


  const {
    error:
      processingError,
  } =
    await admin
      .from(
        "notification_deliveries"
      )
      .update({
        status:
          "processing",

        provider:
          "resend",

        recipient,

        attempt_count:
          currentAttempts +
          1,

        last_attempt_at:
          now,

        failed_at:
          null,

        failure_reason:
          null,
      })
      .eq(
        "id",
        deliveryId
      );


  if (
    processingError
  ) {
    console.error(
      "Email delivery processing update failed"
    );


    return null;
  }


  /*
   * ========================================
   * 5. Render
   * ========================================
   */

  const rendered =
    renderNotificationEmail(
      notification
    );


  /*
   * ========================================
   * 6. Send
   * ========================================
   */

  try {
    const result =
      await sendEmail({
        to:
          recipient,

        subject:
          rendered.subject,

        html:
          rendered.html,

        text:
          rendered.text,
      });


    const {
      error:
        sentError,
    } =
      await admin
        .from(
          "notification_deliveries"
        )
        .update({
          status:
            "sent",

          provider:
            result.provider,

          provider_message_id:
            result
              .providerMessageId,

          sent_at:
            new Date()
              .toISOString(),

          failed_at:
            null,

          failure_reason:
            null,
        })
        .eq(
          "id",
          deliveryId
        );


        if (
          sentError
        ) {
          console.error(
            "Email provider succeeded but local delivery sync failed"
          );
        
        
          /*
           * ========================================
           * Ambiguous Provider Result
           * ========================================
           *
           * Resend 已经返回 provider_message_id，
           * 因此不能安全地再次发送。
           *
           * 尝试把 Delivery 标记为 unknown，
           * 等管理员人工核对 Provider。
           */
        
          const {
            error:
              unknownError,
          } =
            await admin
              .from(
                "notification_deliveries"
              )
              .update({
                status:
                  "unknown",
        
                provider:
                  result.provider,
        
                provider_message_id:
                  result
                    .providerMessageId,
        
                failure_reason:
                  "Provider 已接受 Email，但本地 sent 状态同步失败，需要人工核对。",
        
                failed_at:
                  null,
              })
              .eq(
                "id",
                deliveryId
              );
        
        
          if (
            unknownError
          ) {
            console.error(
              "Email unknown-state fallback update failed"
            );
          }
        
        
          return null;
        }


    return {
      success:
        true,

      providerMessageId:
        result
          .providerMessageId,
    };

  } catch (
    error
  ) {
    const message =
      error instanceof Error
        ? error.message
        : "EMAIL_SEND_FAILED";


    console.error(
      "Notification email send failed:",
      {
        attempt:
          currentAttempts +
          1,
      }
    );


    const {
      error:
        failedUpdateError,
    } =
      await admin
        .from(
          "notification_deliveries"
        )
        .update({
          status:
            "failed",

          failed_at:
            new Date()
              .toISOString(),

          failure_reason:
            message,
        })
        .eq(
          "id",
          deliveryId
        );


    if (
      failedUpdateError
    ) {
      console.error(
        "Email failure state update failed"
      );
    }


    return null;
  }
}