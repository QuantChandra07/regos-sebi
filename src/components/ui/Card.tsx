import React from "react";
import clsx from "clsx";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glow?: boolean;
}

export function Card({ children, className, glow = false, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        "glass-card relative overflow-hidden rounded-2xl p-5 text-gray-100",
        "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
        glow && "shadow-glow",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}