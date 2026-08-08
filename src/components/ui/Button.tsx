"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost";

type ButtonProps =
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    children: ReactNode;
  };

const variantStyles: Record<
  ButtonVariant,
  string
> = {
  primary:
    "border border-cyan-400/80 bg-cyan-500 text-black font-semibold shadow-[0_8px_20px_rgba(6,182,212,0.22)] hover:border-cyan-300 hover:bg-cyan-400",

  secondary:
    "border border-white/10 bg-white/5 text-gray-100 hover:border-white/15 hover:bg-white/10",

  ghost:
    "border border-transparent bg-transparent text-gray-200 hover:bg-white/5 hover:text-white",
};

export function Button({
  children,
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm",
        "transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-cyan-400/70 focus-visible:ring-offset-2",
        "focus-visible:ring-offset-[#08111d]",
        "disabled:cursor-not-allowed disabled:opacity-60",
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;