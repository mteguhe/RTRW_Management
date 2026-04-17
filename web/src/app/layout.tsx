import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sinergi Warga - Rusun Cinta Kasih Tzu Chi",
  description: "Platform digital manajemen RT/RW Rusun Cinta Kasih Tzu Chi, RW 017 Cengkareng Timur, Jakarta Barat.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface text-on-surface antialiased">{children}</body>
    </html>
  );
}
