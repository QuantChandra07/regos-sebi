"use client";

import React from "react";
import clsx from "clsx";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = "primary",
  ...props
}) => {
  const styles = {
    primary:
      "border border-cyan-400/80 bg-cyan-500 text-black font-semibold shadow-[0_8px_20px_rgba(6,182,212,0.22)] hover:bg-cyan-400 hover:border-cyan-300",
    secondary:
      "border border-white/10 bg-white/5 text-gray-100 hover:bg-white/10 hover:border-white/15",
    ghost:
      "border border-transparent bg-transparent text-gray-200 hover:bg-white/5 hover:text-white",
  };

  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08111d]",
        "disabled:cursor-not-allowed disabled:opacity-60",
        styles[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};