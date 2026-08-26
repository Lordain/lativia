export const brandConfig = {
  name:
    "Lativia",

  shortName:
    "LATIVIA",

  logoUrl:
    "/brand/logo-1.png" as string | null,

  footerLogoUrl:
    "/brand/logo-2.png" as string | null,

  presentationLogoUrl:
    "/brand/logo-2.png" as string | null,

  logoDisplay: {
    headerClassName:
      "h-7 sm:h-8 lg:h-9",

    presentationClassName:
      "h-8 sm:h-9",

    footerClassName:
      "h-7 sm:h-8",
  },

  presentation: {
    watermarkLabel:
      "INTERNAL CONSULTATION",

    confidentialityLabel:
      "内部咨询资料",

    footerText:
      "仅供咨询服务过程中演示使用",
  },
} as const;