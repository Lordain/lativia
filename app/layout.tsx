import type {
  Metadata,
} from "next";

import {
  Geist,
  Geist_Mono,
} from "next/font/google";

import "./globals.css";


const geistSans = Geist({
  variable:
    "--font-geist-sans",
  subsets: [
    "latin",
  ],
});


const geistMono =
  Geist_Mono({
    variable:
      "--font-geist-mono",
    subsets: [
      "latin",
    ],
  });


export const metadata:
  Metadata = {
    metadataBase:
      new URL(
        "https://lativiaglobal.com"
      ),

    alternates: {
      canonical:
        "/",
    },

    title: {
      default:
        "Lativia｜墨西哥华人办事与官方手续中文协助",
      template:
        "%s | Lativia",
    },

    description:
      "面向在墨西哥生活、工作和投资的中国用户，提供 RFC、e.firma、SAT、INM、Cetesdirecto 等墨西哥官方流程的中文说明与办理协助。",

    applicationName:
      "Lativia",

    authors: [
      {
        name:
          "Lativia",
      },
    ],

    creator:
      "Lativia",

    publisher:
      "Lativia",

    formatDetection: {
      email:
        false,

      address:
        false,

      telephone:
        false,
    },

    openGraph: {
      type:
        "website",

      locale:
        "zh_CN",

      url:
        "https://lativiaglobal.com",

      siteName:
        "Lativia",

      title:
        "Lativia｜墨西哥华人办事与官方手续中文协助",

      description:
        "面向中国用户提供墨西哥 RFC、e.firma、SAT、INM、Cetesdirecto 等官方流程的中文说明与办理协助。",

      images: [
        {
          url:
            "/og-image.png",

          width:
            1200,

          height:
            630,

          alt:
            "Lativia｜墨西哥华人办事与官方手续中文协助",
        },
      ],
    },

    twitter: {
      card:
        "summary_large_image",

      title:
        "Lativia｜墨西哥华人办事与官方手续中文协助",

      description:
        "面向中国用户提供墨西哥 RFC、e.firma、SAT、INM、Cetesdirecto 等官方流程的中文说明与办理协助。",

      images: [
        "/og-image.png",
      ],
    },
  };


export default function RootLayout({
  children,
}: Readonly<{
  children:
    React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-slate-50 text-slate-950">
        {children}
      </body>
    </html>
  );
}