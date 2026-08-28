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

    paid_at:
      string | null;
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


    return `${currency} ${new Intl.NumberFormat(
      "zh-CN",
      {
        maximumFractionDigits:
          2,
      }
    ).format(
      numericAmount
    )}`;
  }


  function formatPaymentMethod(
    paymentMethod:
      string | null,
    paymentProvider:
      string | null
  ) {
    if (
      paymentMethod ===
      "wechat_pay"
    ) {
      return "微信支付";
    }


    if (
      paymentMethod ===
      "card"
    ) {
      if (
        paymentProvider ===
        "stripe"
      ) {
        return "银行卡 / Stripe";
      }


      return "银行卡";
    }


    if (
      paymentMethod ===
      "local_payment"
    ) {
      if (
        paymentProvider ===
        "mercado_pago"
      ) {
        return "Mercado Pago";
      }


      return "本地支付";
    }


    return (
      paymentMethod ??
      paymentProvider ??
      "-"
    );
  }


  export async function safeSendAdminPaidOrderEmail(
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
       * 不影响付款和客户通知主流程。
       */

      if (
        recipients.length ===
        0
      ) {
        console.warn(
          "Admin paid order email skipped: ADMIN_NOTIFICATION_EMAILS not configured"
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
            paid_at
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
          "Admin paid order email order lookup failed"
        );


        return null;
      }


      const order =
        orderData as
          OrderRow;


      /*
       * 只通知真正已经付款的订单。
       */

      if (
        !order.paid_at
      ) {
        console.warn(
          "Admin paid order email skipped: order is not paid"
        );


        return null;
      }


      /*
       * ========================================
       * 2. Resolve Service
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
       * 3. Resolve Option
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


      const paymentLabel =
        formatPaymentMethod(
          order.payment_method,
          order.payment_provider
        );


      const paidAtLabel =
        new Date(
          order.paid_at
        ).toLocaleString(
          "zh-CN",
          {
            timeZone:
              "America/Mexico_City",
          }
        );


      /*
       * ========================================
       * 4. Render Email
       * ========================================
       */

      const subject =
        `[Lativia] 已付款订单 · ${serviceTitle}`;


      const text = [
        "Lativia 收到一笔已付款订单。",
        "",
        `服务：${serviceTitle}`,

        optionTitle
          ? `方案：${optionTitle}`
          : null,

        `订单号：${order.id}`,
        `金额：${amountLabel}`,
        `付款方式：${paymentLabel}`,
        `付款时间：${paidAtLabel}`,
        "",
        "请登录 Lativia Admin 查看并开始处理订单。",
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
              Lativia 收到已付款订单
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
              ${escapeHtml(
                paymentLabel
              )}
            </p>

            <p>
              <strong>付款时间：</strong>
              ${escapeHtml(
                paidAtLabel
              )}
            </p>

            <p style="margin-top:24px;color:#475569;">
              请登录 Lativia Admin 查看并开始处理订单。
            </p>
          </div>
        `;


      /*
       * ========================================
       * 5. Send
       * ========================================
       *
       * 每个管理员邮箱单独发送。
       *
       * 其中一个发送失败，
       * 不影响其他管理员邮箱，
       * 更不会影响 Payment 主流程。
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
                "Admin paid order email sent:",
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
          "Admin paid order email partial failure:",
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
       * Email 永远只是 secondary side effect。
       *
       * 即使管理员邮件失败，
       * 付款成功状态也绝不能回滚。
       */

      console.error(
        "Admin paid order email failed"
      );


      return null;
    }
  }
