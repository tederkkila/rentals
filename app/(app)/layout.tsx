import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NuqsAdapter} from 'nuqs/adapters/next/app'

import { TRPCReactProvider } from "@/trpc/client";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import "./hm.css"

import { Theme, ThemePanel } from "@radix-ui/themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HenryMitchell.Net",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
      <NuqsAdapter>
          <TRPCReactProvider>
              <Theme radius="full">
                  {children}
                  <ThemePanel />
              </Theme>
          </TRPCReactProvider>
      </NuqsAdapter>
      </body>
    </html>
  );
}
