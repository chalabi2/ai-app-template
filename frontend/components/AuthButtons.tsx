"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function AuthButtons() {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        <Button
          className="text-sm  p-3 justify-center items-center flex bg-primary rounded-lg"
          onClick={() => signOut()}
        >
          {session.user?.email}
        </Button>
      </>
    );
  }
  return (
    <>
      <Button onClick={() => signIn("google")}>Sign in with Google</Button>
    </>
  );
}
