import "@/app/globals.css";
import MapProvider from "@/context/constextMap";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MapProvider>
      <html lang="es">
        <body>{children}</body>
      </html>
    </MapProvider>
  );
}
