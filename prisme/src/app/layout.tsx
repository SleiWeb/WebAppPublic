import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Prisme — Forstå det. Så husk det.",
    template: "%s · Prisme",
  },
  description:
    "Interaktiv naturvidenskab for 5.–9. klasse og gymnasiet. Matematik, fysik, kemi, biologi og geografi — forstå det visuelt, træn det aktivt, og lad opgaverne rette sig selv.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="da" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
