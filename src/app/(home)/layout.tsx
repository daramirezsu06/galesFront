import type { Metadata } from "next";

import "@/app/globals.css";
import { caveat, inter } from "@/app/fonts";
import Menu from "@/components/Menu/HomeMenu/Index";
import HomeMenu from "@/components/Menu/HomeMenu/Index";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Delicias Gales",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const MapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  return (
    <html lang="es">
      {/* <link rel="icon" href="next.svg" type="image/x-icon" /> */}

      <body
        className={`${caveat.variable} ${inter.variable} antialiased bg-custom-tertiary`}>
        <HomeMenu />
        {children}
        <Footer />
      </body>
    </html>
  );
}
