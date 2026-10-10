import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  className = "",
  disabled,
  ...props
}) => {
  const sizeStyles = {
    sm: "px-2.5 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  const variantStyles = {
    primary: "bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold shadow-sm shadow-emerald-500/20 disabled:opacity-50",
    secondary: "bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 disabled:opacity-50",
    outline: "bg-transparent hover:bg-slate-800/60 text-slate-200 border border-slate-700 disabled:opacity-50",
    danger: "bg-rose-500 hover:bg-rose-600 text-white font-medium disabled:opacity-50",
    ghost: "bg-transparent hover:bg-slate-800 text-slate-300 hover:text-white disabled:opacity-50"
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 disabled:cursor-not-allowed ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};
