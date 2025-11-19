import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mjengo Connect",
  description: "Find contractors, laborers, and building materials with ease.",
  icons: {
    icon: "/images/log.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {/* Apply font variables inside a wrapper div */}
        <div className={`${geistSans.variable} ${geistMono.variable}`}>
          {children}
        </div>
      </body>
    </html>
  );
}

