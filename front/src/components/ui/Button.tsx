import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "link" | "ghost";
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
};

export function Button({ children, variant = "primary", onClick, type = "button", disabled = false, className = "" }: ButtonProps) {
  return (
    <button className={`btn btn--${variant} ${className}`} onClick={onClick} type={type} disabled={disabled}>
      {children}
    </button>
  );
}
