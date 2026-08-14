import type { Metadata } from "next";
import { Geist, Geist_Mono, Sour_Gummy,  } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const sourGummy = Sour_Gummy({
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    variable: "--font-sour-gummy",
    subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Social Media AU Creator",
  description: "A web app that handles all the formatting work for social media AUs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistMono.variable} ${geistSans.variable} ${sourGummy.variable} flex min-h-screen flex-col`}>
      <NavBar />
      {children}
      </body>
    </html>
  );
}
