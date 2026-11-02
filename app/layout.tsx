import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/NavBar";

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
      <body className="flex min-h-screen flex-col">
      <NavBar />
      <main className = "flex flex-1 flex-col">
          {children}
      </main>
      </body>
    </html>
  );
}
