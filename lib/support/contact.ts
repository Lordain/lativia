export const SUPPORT_EMAIL =
  process.env
    .NEXT_PUBLIC_SUPPORT_EMAIL
    ?.trim() ??
  "";


export const SUPPORT_WHATSAPP =
  process.env
    .NEXT_PUBLIC_SUPPORT_WHATSAPP
    ?.replace(
      /\D/g,
      ""
    ) ??
  "";


export const hasSupportEmail =
  SUPPORT_EMAIL.length >
  0;


export const hasSupportWhatsApp =
  SUPPORT_WHATSAPP.length >
  0;