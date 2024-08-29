import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={`${inter.className} flex flex-col min-h-full`}>
        <Providers>
          <Header />
          <main className="flex-grow flex justify-center items-center">
            <div className="w-full max-w-[90rem] px-4">{children}</div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
