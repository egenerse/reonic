import clsx from "clsx"
import React from "react"

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger"
  fullWidth?: boolean
}

export const Button: React.FC<Props> = ({
  variant = "primary",
  children,
  fullWidth,
  className,
  ...props
}) => {
  return (
    <button
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
      {children}
    </button>
  )
}
