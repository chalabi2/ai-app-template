"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";

import { Button } from "@/components/ui/button";

import { useTheme } from "next-themes";

import { AuthButtons } from "@/components/AuthButtons";
import { Icons } from "@/components/icons";

function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <h1 className="text-4xl font-bold mb-6">Ai App Template</h1>
      <p className="text-xl mb-8">
        Remove backgrounds from your images with ease.
      </p>
      <AuthButtons />
      <div className="absolute bottom-4 right-4 flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-light">Powered by</h1>
        <Image
          src="/akash.svg"
          alt="powered by akash"
          width={200}
          height={200}
          priority
        />
      </div>
    </div>
  );
}

export default function Home() {
  const { data: session, status } = useSession();

  const { theme, setTheme } = useTheme();

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        {" "}
        <Icons.spinner className="mr-2 my-auto h-24 w-24 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <LandingPage />;
  }

  return (
    <>
      <header className="sticky top-0 z-10 bg-background shadow-md">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">ai-app</h1>
          <div className="flex items-center space-x-4">
            <AuthButtons />
            <Button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? "Light" : "Dark"} Mode
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4"></main>
    </>
  );
}
