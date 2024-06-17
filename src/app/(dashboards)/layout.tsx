import type { Metadata } from "next";

import "@/app/globals.css";
import { caveat, inter } from '@/app/fonts';
import DashboardMenu from '@/components/Menu/dashboardMenu';
import DashboardSidebar from '@/components/Menu/dashboardSidebar';

export const metadata: Metadata = {
  title: "Delicias Gales",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      {/* <link rel="icon" href="next.svg" type="image/x-icon" /> */}
      <body
        className={`${caveat.variable} ${inter.variable} min-h-screen antialiased bg-custom-tertiary`}>
        <DashboardMenu />
        <main className="flex w-full min-h-screen">
          <DashboardSidebar />

          <section
            className={`w-full min-h-screen ml-0 py-4 px-4 transform transition duration-500 ease-in-out border-l border-solid border-slate-400 bg-text-color`}
          >
            {/* <lumau-spinner id="lumau-spinner"></lumau-spinner> */}

            {children}
          </section>
        </main>

      </body>
    </html>
  );
}
