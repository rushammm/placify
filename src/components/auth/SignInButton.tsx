"use client";

import { signIn } from "next-auth/react";

interface SignInButtonProps {
  className?: string;
}

export function SignInButton({ className = "" }: SignInButtonProps) {
  return (
    <button
      onClick={() => signIn()}
      className={`inline-flex items-center justify-center px-4 py-2 rounded-xl font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary bg-transparent border border-gray-300 text-black hover:bg-gray-100 dark:border-gray-600 dark:text-white dark:hover:bg-gray-800 ${className}`}
    >
      Sign In
    </button>
  );
}
