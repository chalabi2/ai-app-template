import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Header from "@/components/Header";
import { Varela } from "next/font/google";

const vt323 = Varela({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Chat App",
  description: "An interface for chatting with ai models.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${vt323.className} flex flex-col min-h-full bg-[url('/anime-background.jpg')] bg-cover bg-center bg-purple-950`}
      >
        <Providers>
          <Header />
          <main className="flex-grow flex justify-center bg-purple-950 overflow-hidden items-center">
            <div className="w-full min-w-[100%] px-4">{children}</div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
