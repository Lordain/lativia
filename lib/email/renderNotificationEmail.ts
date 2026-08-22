import type {
  Notification,
} from "@/types/notification";
import {
  brandConfig,
} from "@/lib/brand/brandConfig";


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


export function renderNotificationEmail(
  notification:
    Notification
) {
  const title =
    escapeHtml(
      notification.title
    );


  const message =
    escapeHtml(
      notification.message
    )
      .replaceAll(
        "\n",
        "<br />"
      );


  /*
   * ========================================
   * Site URL
   * ========================================
   *
   * Development:
   * 可以使用当前 Cloudflare Tunnel URL。
   *
   * Production:
   * 以后改成正式域名。
   */

  const siteUrl =
    process.env
      .NEXT_PUBLIC_SITE_URL
      ?.trim()
      .replace(
        /\/+$/,
        ""
      );


  const orderUrl =
    notification.orderId &&
    siteUrl
      ? `${siteUrl}/account/orders/${notification.orderId}`
      : null;


  /*
   * ========================================
   * HTML
   * ========================================
   */

  const html =
    `
<!doctype html>
<html>
  <body
    style="
      margin:0;
      padding:0;
      background:#f7f7f7;
      font-family:Arial,Helvetica,sans-serif;
      color:#111827;
    "
  >
    <div
      style="
        max-width:640px;
        margin:0 auto;
        padding:32px 16px;
      "
    >
      <div
        style="
          background:#ffffff;
          border-radius:12px;
          padding:32px;
          border:1px solid #e5e7eb;
        "
      >
        <p
          style="
            margin:0 0 8px;
            font-size:12px;
            font-weight:700;
            color:#2563eb;
            text-transform:uppercase;
            letter-spacing:.08em;
          "
        >
          ${brandConfig.name}
        </p>

        <h1
          style="
            margin:0;
            font-size:24px;
            line-height:1.35;
          "
        >
          ${title}
        </h1>

        <div
          style="
            margin-top:20px;
            font-size:15px;
            line-height:1.8;
            color:#4b5563;
          "
        >
          ${message}
        </div>

        ${
          orderUrl
            ? `
        <p
          style="
            margin-top:28px;
          "
        >
          <a
            href="${escapeHtml(
              orderUrl
            )}"
            style="
              display:inline-block;
              background:#2563eb;
              color:#ffffff;
              text-decoration:none;
              padding:12px 18px;
              border-radius:8px;
              font-size:14px;
              font-weight:700;
            "
          >
            查看订单
          </a>
        </p>
        `
            : ""
        }

        <p
          style="
            margin-top:32px;
            margin-bottom:0;
            font-size:12px;
            line-height:1.6;
            color:#9ca3af;
          "
        >
          此邮件由 ${brandConfig.name} 系统自动发送。
        </p>
      </div>
    </div>
  </body>
</html>
    `.trim();


  /*
   * ========================================
   * Plain Text
   * ========================================
   */

  const text =
    [
      notification.title,

      "",

      notification.message,

      orderUrl
        ? `查看订单：${orderUrl}`
        : "",
    ]
      .filter(
        Boolean
      )
      .join(
        "\n"
      );


  return {
    subject:
      notification.title,

    html,

    text,
  };
}