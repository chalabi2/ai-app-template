"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { AuthButtons } from "@/components/AuthButtons";
import { useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();
  return (
    <header
      className={`sticky top-0 z-10 bg-purple-950 border-2 border-pink-800  ${
        session ? "block" : "hidden"
      }`}
    >
      <div className="container mx-auto p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-300">Best Fwend</h1>
        <div className="flex items-center space-x-4">
          <AuthButtons />
        </div>
      </div>
    </header>
  );
}
