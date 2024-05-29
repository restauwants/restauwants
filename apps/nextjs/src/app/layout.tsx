import type { Metadata } from "next";
import { Lily_Script_One } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { cn } from "@restauwants/ui";
import { Toaster } from "@restauwants/ui/toast";

import { env } from "~/env";
import { TrpcReactProvider } from "~/trpc/react";

import "~/app/globals.css";

const lilyScriptOne = Lily_Script_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-lily-script-one",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    env.VERCEL_ENV === "production"
      ? "https://www.restauwants.com"
      : "http://localhost:3000",
  ),
  title: "RestauWants",
  description: "Track, review, wishlist, and share restaurants with friends",
  openGraph: {
    title: "RestauWants",
    description: "Track, review, wishlist, and share restaurants with friends",
    url: "https://www.restauwants.com",
    siteName: "RestauWants",
  },
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "bg-background font-sans text-foreground antialiased",
          GeistSans.variable,
          GeistMono.variable,
          lilyScriptOne.variable,
        )}
      >
        <TrpcReactProvider>
          <main>{props.children}</main>
        </TrpcReactProvider>
        <Toaster />
      </body>
    </html>
  );
}
