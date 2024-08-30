"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export function AuthButtons() {
  const { data: session } = useSession();

  const buttonClasses = `
    px-4 py-2 bg-purple-900 text-gray-300 font-bold border-2 border-pink-500 shadow-[3px_3px_0_0_#ff79c6]
    hover:bg-purple-700 hover:text-pink-200
    active:shadow-[1px_1px_0_0_#ff79c6] active:translate-y-px active:translate-x-px
    transition-all duration-100
  `;

  if (session) {
    return (
      <button className={buttonClasses} onClick={() => signOut()}>
        Sign Out ({session.user?.email})
      </button>
    );
  }
  return (
    <button className={buttonClasses} onClick={() => signIn("google")}>
      Sign in with Google
    </button>
  );
}
