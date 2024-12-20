
import type { Metadata } from "next";

import "@/app/globals.css";
import { caveat, inter } from "@/app/fonts";
import DashboardMenu from "@/components/Menu/dashboardMenu";
import DashboardSidebar from "@/components/Menu/dashboardSidebar";
import { getSession } from "../lib/session";
import { UserSession } from "../lib/definitions";


export const metadata: Metadata = {
  title: "Delicias Gales",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
 
  const session = await getSession();

  // Verificamos si la sesión es nula
  if (!session) {
    return (
      <html lang="es">
        <body>
          <p>No estás autenticado. Por favor, inicia sesión.</p>
        </body>
      </html>
    );
  }

  // Ahora sabemos que session no es null
  const user = session.user as UserSession;

  return (
    <html lang="es">
      {/* <link rel="icon" href="next.svg" type="image/x-icon" /> */}
      
        <body
          className={`${caveat.variable} ${inter.variable} h-screen antialiased bg-custom-tertiary`}>
          <DashboardMenu user={user} />
          <main className="flex w-full min-h-screen">
            <DashboardSidebar user={user} />

            <section
              className={`w-full max-h-screen overflow-y-auto ml-0 py-4 px-4 transform transition duration-500 ease-in-out border-l border-solid border-slate-400 bg-text-color`}>
              <div className="mt-16">{children}</div>
            </section>
          </main>
          <div id="modal"></div>
        </body>
      
    </html>
  );
}
