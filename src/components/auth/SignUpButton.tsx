"use client";

import { signIn } from "next-auth/react";

interface SignUpButtonProps {
  variant?: "primary" | "secondary";
  size?: "default" | "large";
  className?: string;
  children?: React.ReactNode;
}

export function SignUpButton({ 
  variant = "secondary", 
  size = "default", 
  className = "",
  children = "Sign Up"
}: SignUpButtonProps) {
  const baseClasses = "inline-flex items-center justify-center rounded-xl font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary";
  
  const sizeClasses = {
    default: "px-4 py-2",
    large: "px-6 py-3"
  };
  
  const variantClasses = {
    primary: "bg-[#45cee3] text-white hover:bg-[#39a7b8] shadow-soft",
    secondary: "bg-transparent border border-gray-300 text-black hover:bg-gray-100 dark:border-gray-600 dark:text-white dark:hover:bg-gray-800"
  };

  return (
    <button
      onClick={() => signIn()}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
