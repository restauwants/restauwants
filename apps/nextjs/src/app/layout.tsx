import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { cn } from "@restauwants/ui";
import { ThemeProvider, ThemeToggle } from "@restauwants/ui/theme";
import { Toaster } from "@restauwants/ui/toast";

import { env } from "~/env";
import { TRPCReactProvider } from "~/trpc/react";
import { Navigation } from "./_components/navigation";

import "~/app/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    env.VERCEL_ENV === "production"
      ? "https://restauwants-nextjs.vercel.app/"
      : "http://localhost:3000",
  ),
  title: "RestauWants",
  description: "Simple monorepo with shared backend for web & mobile apps",
  openGraph: {
    title: "RestauWants",
    description: "Simple monorepo with shared backend for web & mobile apps",
    url: "https://restauwants-nextjs.vercel.app/",
    siteName: "RestauWants",
  },
  twitter: {
    card: "summary_large_image",
    site: "@jullerino",
    creator: "@jullerino",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground antialiased",
          GeistSans.variable,
          GeistMono.variable,
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TRPCReactProvider>
            <main>{props.children}</main>
          </TRPCReactProvider>
          <div className="fixed bottom-4 grid w-full grid-cols-3 justify-items-center gap-4">
            <div />
            <Navigation />
            <div className="my-auto ml-auto mr-2">
              <ThemeToggle />
            </div>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
