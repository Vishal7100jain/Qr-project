import React, { ReactNode } from "react";
import { ClassNameValue } from "tailwind-merge";

interface ButtonProps {
  children: ReactNode;
  size?: "xs" | "sm" | "md" | "lg";
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "outline"
    | "ghost"
    | "link";
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  onClick,
  className = "",
  disabled = false,
  type = "button",
}) => {
  // Sizes
  const sizeClasses = {
    xs: "px-3 py-1.5 text-xs",
    sm: "px-4 py-2 text-sm",
    md: "px-5 py-3 text-sm",
    lg: "px-6 py-3.5 text-base",
  };

  // Variants
  const variantClasses: { [key: string]: ClassNameValue } = {
    primary:
      "bg-brand-500 text-white shadow hover:bg-brand-600 disabled:bg-brand-300",

    secondary: "bg-gray-900 text-white hover:bg-gray-800 disabled:bg-gray-400",

    success: "bg-green-600 text-white hover:bg-green-700 disabled:bg-green-300",

    danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300",

    warning:
      "bg-yellow-500 text-white dark:bg-yellow-900 dark:text-yellow-200 hover:bg-yellow-600 disabled:bg-yellow-300",

    outline:
      "bg-transparent text-gray-700 ring-1 ring-gray-300 hover:bg-gray-50 dark:text-gray-300 dark:ring-gray-600 dark:hover:bg-gray-800",

    ghost: "bg-gray-800 text-gray-200 dark:text-gray-800 dark:bg-gray-200",

    link: "bg-transparent text-brand-600 hover:underline p-0 h-auto",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2
        font-medium rounded-lg transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${disabled ? "cursor-not-allowed opacity-50" : ""}
        ${className}
      `}
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;
