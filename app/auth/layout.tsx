import type {
  Metadata,
} from "next";

import type {
  ReactNode,
} from "react";


export const metadata:
  Metadata = {
    robots: {
      index:
        false,

      follow:
        false,

      googleBot: {
        index:
          false,

        follow:
          false,
      },
    },
  };


interface Props {
  children:
    ReactNode;
}


export default function AuthLayout({
  children,
}: Props) {
  return children;
}