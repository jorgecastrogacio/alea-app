import type { Metadata, Viewport } from "next";
import "./globals.css";
import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
  title: "ALEA | Descubre tu próximo libro",
  description: "Recomendador de literatura infantil y juvenil en España. Descubre libros físicos sin adicción ni pantallas invasivas.",
  manifest: "/manifest.json",
  icons: {
    icon: "/assets/mascot/banner_mascot.jpg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#4f46e5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <body className="h-full bg-[#EAEBF9] antialiased font-sans select-none">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
