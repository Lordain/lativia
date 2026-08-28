import {
    sendEmail,
  } from "@/lib/email/sendEmail";

  import {
    createAdminClient,
  } from "@/lib/supabase/admin";


  interface OrderRow {
    id: string;

    service_id:
      string | null;

    service_option_id:
      string | null;

    amount:
      number | string | null;

    currency: string;

    payment_method:
      string | null;

    payment_provider:
      string | null;

    payment_status: string;
  }


  function escapeHtml(
    value: string
  ) {
    return value
      .replaceAll(
        "&",
        "&amp;"
      )
      .replaceAll(
        "<",
        "&lt;"
      )
      .replaceAll(
        ">",
        "&gt;"
      )
      .replaceAll(
        '"',
        "&quot;"
      )
      .replaceAll(
        "'",
        "&#039;"
      );
  }


  function formatAmount(
    amount:
      number | string | null,
    currency: string
  ) {
    if (
      amount === null ||
      amount === undefined
    ) {
      return "-";
    }


    const numericAmount =
      Number(
        amount
      );


    if (
      !Number.isFinite(
        numericAmount
      )
    ) {
      return `${currency} ${amount}`;
    }


    const formatted =
      new Intl.NumberFormat(
        "zh-CN",
        {
          maximumFractionDigits:
            2,
        }
      ).format(
        numericAmount
      );


    if (
      currency ===
      "CNY"
    ) {
      return `CNY ¥${formatted}`;
    }


    return `${currency} ${formatted}`;
  }


  export async function safeSendAdminManualWeChatOrderEmail(
    orderId: string
  ) {
    try {
      const recipients =
        Array.from(
          new Set(
            process.env
              .ADMIN_NOTIFICATION_EMAILS
              ?.split(",")
              .map(
                email =>
                  email.trim()
              )
              .filter(
                Boolean
              ) ??
            []
          )
        );


      /*
       * Admin Email 尚未配置时，
       * 不影响建立订单主流程。
       */

      if (
        recipients.length ===
        0
      ) {
        console.warn(
          "Admin manual WeChat order email skipped: ADMIN_NOTIFICATION_EMAILS not configured"
        );


        return null;
      }


      const admin =
        createAdminClient();


      /*
       * ========================================
       * 1. Load Order
       * ========================================
       */

      const {
        data:
          orderData,

        error:
          orderError,
      } =
        await admin
          .from(
            "orders"
          )
          .select(`
            id,
            service_id,
            service_option_id,
            amount,
            currency,
            payment_method,
            payment_provider,
            payment_status
          `)
          .eq(
            "id",
            orderId
          )
          .single();


      if (
        orderError ||
        !orderData
      ) {
        console.error(
          "Admin manual WeChat order email order lookup failed"
        );


        return null;
      }


      const order =
        orderData as
          OrderRow;


      /*
       * ========================================
       * 2. Strict Manual WeChat Guard
       * ========================================
       *
       * 只允许：
       *
       * unpaid
       * CNY
       * wechat_pay
       * provider = null
       */

      const isManualWeChatOrder =
        order.payment_status ===
          "unpaid" &&
        order.currency ===
          "CNY" &&
        order.payment_method ===
          "wechat_pay" &&
        order.payment_provider ===
          null;


      if (
        !isManualWeChatOrder
      ) {
        console.warn(
          "Admin manual WeChat order email skipped: order is not an unpaid manual WeChat order"
        );


        return null;
      }


      /*
       * ========================================
       * 3. Resolve Service
       * ========================================
       */

      let serviceTitle =
        "未命名服务";


      if (
        order.service_id
      ) {
        const {
          data:
            service,
        } =
          await admin
            .from(
              "services"
            )
            .select(`
              title
            `)
            .eq(
              "id",
              order.service_id
            )
            .maybeSingle();


        if (
          service?.title
        ) {
          serviceTitle =
            service.title;
        }
      }


      /*
       * ========================================
       * 4. Resolve Option
       * ========================================
       */

      let optionTitle =
        "";


      if (
        order.service_option_id
      ) {
        const {
          data:
            option,
        } =
          await admin
            .from(
              "service_options"
            )
            .select(`
              title
            `)
            .eq(
              "id",
              order.service_option_id
            )
            .maybeSingle();


        if (
          option?.title
        ) {
          optionTitle =
            option.title;
        }
      }


      const amountLabel =
        formatAmount(
          order.amount,
          order.currency
        );


      /*
       * ========================================
       * 5. Render Email
       * ========================================
       */

      const subject =
        `[Lativia] 新的微信待付款订单 · ${serviceTitle}`;


      const text = [
        "Lativia 收到一笔新的人民币微信人工付款订单。",
        "",
        `服务：${serviceTitle}`,

        optionTitle
          ? `方案：${optionTitle}`
          : null,

        `订单号：${order.id}`,
        `金额：${amountLabel}`,
        "付款方式：人民币微信人工付款",
        "付款状态：等待客户付款",
        "",
        "该订单需要人工跟进。",
        "请登录 Lativia Admin 查看订单，并等待客户通过官方客服渠道联系。",
      ]
        .filter(
          (
            line
          ): line is string =>
            Boolean(
              line
            )
        )
        .join(
          "\n"
        );


      const html =
        `
          <div style="font-family:Arial,sans-serif;line-height:1.7;color:#0f172a;">
            <h2 style="margin:0 0 20px;">
              Lativia 新的微信待付款订单
            </h2>

            <p>
              <strong>服务：</strong>
              ${escapeHtml(
                serviceTitle
              )}
            </p>

            ${
              optionTitle
                ? `
                  <p>
                    <strong>方案：</strong>
                    ${escapeHtml(
                      optionTitle
                    )}
                  </p>
                `
                : ""
            }

            <p>
              <strong>订单号：</strong>
              ${escapeHtml(
                order.id
              )}
            </p>

            <p>
              <strong>金额：</strong>
              ${escapeHtml(
                amountLabel
              )}
            </p>

            <p>
              <strong>付款方式：</strong>
              人民币微信人工付款
            </p>

            <p>
              <strong>付款状态：</strong>
              等待客户付款
            </p>

            <div style="margin-top:24px;padding:16px;border-radius:10px;background:#eff6ff;color:#1e3a8a;">
              该订单需要人工跟进。请登录 Lativia Admin 查看订单，
              并等待客户通过官方客服渠道联系。
            </div>
          </div>
        `;


      /*
       * ========================================
       * 6. Send
       * ========================================
       *
       * 每个管理员邮箱独立发送。
       */

      const results =
        await Promise.allSettled(
          recipients.map(
            async recipient => {
              const result =
                await sendEmail({
                  to:
                    recipient,

                  subject,

                  html,

                  text,
                });


              console.log(
                "Admin manual WeChat order email sent:",
                {
                  orderId:
                    order.id,

                  recipient,

                  providerMessageId:
                    result.providerMessageId,
                }
              );


              return result;
            }
          )
        );


      const failedCount =
        results.filter(
          result =>
            result.status ===
            "rejected"
        ).length;


      if (
        failedCount >
        0
      ) {
        console.error(
          "Admin manual WeChat order email partial failure:",
          {
            orderId:
              order.id,

            recipientCount:
              recipients.length,

            failedCount,
          }
        );
      }


      return results;

    } catch {
      /*
       * Email 是 secondary side effect。
       *
       * 邮件失败不能导致
       * Customer Order 建立失败。
       */

      console.error(
        "Admin manual WeChat order email failed"
      );


      return null;
    }
  }
