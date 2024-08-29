"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { AuthButtons } from "@/components/AuthButtons";
import { useSession } from "next-auth/react";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  return (
    <header
      className={`sticky top-0 z-10 bg-background shadow-md border-b ${
        session ? "block" : "hidden"
      }`}
    >
      <div className="container mx-auto p-4 flex justify-between items-center ">
        <h1 className="text-2xl font-bold">fren</h1>
        <div className="flex items-center space-x-4">
          <AuthButtons />
          <Button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? "Light" : "Dark"} Mode
          </Button>
        </div>
      </div>
    </header>
  );
}
