import type { Metadata } from "next";
import { Poppins, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider"; // Keep this import
import { LayoutContent } from "@/components/LayoutContent"; // Import the new LayoutContent component

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AeroSafe - Airspace violation detection, collision prediction, and AI alerts",
  description: "Airspace violation detection, collision prediction, and AI alerts",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${geistMono.variable} antialiased `}>
        <SessionProvider> {/* Add SessionProvider here */}
          <LayoutContent>{children}</LayoutContent>
        </SessionProvider> {/* Close SessionProvider here */}
      </body>
    </html>
  );
}
