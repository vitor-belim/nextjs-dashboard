import { inter } from "@/app/ui/fonts";
import { ReactNode } from "react";
import "@/app/ui/global.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
