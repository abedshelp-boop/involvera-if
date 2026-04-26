import type { Metadata } from "next";
import CustomCursor from "@/components/layout/CustomCursor";
import Header from "@/components/layout/Header";
import ConvexProvider from "@/components/providers/ConvexProvider";
import WhatsAppFAB from "@/components/ui/WhatsAppFAB";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Involvera IF — Sport för alla",
    template: "%s — Involvera IF",
  },
  description:
    "Involvera IF är en inkluderande idrottsförening i Helsingborg med fotboll, parasport och calisthenics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&family=Oxanium:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ConvexProvider>
          <CustomCursor />
          <Header />
          {children}
          <WhatsAppFAB />
        </ConvexProvider>
      </body>
    </html>
  );
}
