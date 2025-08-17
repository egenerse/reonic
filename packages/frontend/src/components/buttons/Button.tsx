import clsx from "clsx"
import React from "react"

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outlined"
  fullWidth?: boolean
  isLoading?: boolean
}

export const Button: React.FC<Props> = ({
  variant = "primary",
  children,
  fullWidth,
  className,
  type = "button",
  isLoading = false,
  ...props
}) => {
  return (
    <button
      disabled={props.disabled || isLoading}
      type={type}
      className={clsx(
        "min-w-40 rounded-lg px-5 py-2 font-medium active:scale-95",
        {
          "bg-blue-600 text-white shadow-lg hover:bg-blue-700":
            variant === "primary",
          "bg-gray-300 text-gray-800 hover:bg-gray-400":
            variant === "secondary",
          "bg-red-600 text-white hover:bg-red-700": variant === "danger",
          "w-full": fullWidth,
          "cursor-not-allowed opacity-50": props.disabled,
        },
        className
      )}
      {...props}
    >
      {isLoading ? "Loading..." : children}
    </button>
  )
}
