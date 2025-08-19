import React from "react"
import { ErrorMessage } from "../ErrorMessage"

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  className?: string
  required?: boolean
  error?: string
}

export const InputField: React.FC<Props> = ({
  label,
  className,
  required,
  error,
  ...props
}) => {
  return (
    <div className={className}>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <input
        required={required}
        className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm"
        {...props}
      />
      <ErrorMessage message={error} />
    </div>
  )
}
