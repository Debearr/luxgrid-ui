import * as React from "react";
import { cn } from "../../../utils/cn";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  'aria-label'?: string;
};

const base =
  "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed aria-disabled:opacity-50";

const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-base",
  lg: "h-12 px-6 text-lg",
};

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-[#0A0E1A] text-white hover:bg-[#1A2332] focus:ring-blue-500",
  secondary: "border-2 border-[#4A9EFF] text-[#4A9EFF] hover:bg-[#4A9EFF]/10 focus:ring-blue-500",
  ghost: "text-[#0A0E1A] hover:bg-[#0A0E1A]/10 focus:ring-blue-500",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", type = "button", loading = false, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={loading || props.disabled}
        aria-disabled={loading || props.disabled}
        className={cn(base, sizes[size], variants[variant], className)}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="sr-only">Loading...</span>
          </>
        ) : children}
      </button>
    );
  }
);
Button.displayName = "Button";
