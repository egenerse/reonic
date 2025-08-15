import React from "react"

interface InputFieldProps {
  id: string
  name: string
  label: string
  type?: "text" | "number"
  value: string | number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  min?: number
  max?: number
  placeholder?: string
  required?: boolean
  className?: string
  step?: number
}

export const InputField: React.FC<InputFieldProps> = ({
  id,
  name,
  label,
  type = "text",
  value,
  onChange,
  min,
  max,
  placeholder,
  required = false,
  className = "",
  step,
}) => {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-1 block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        placeholder={placeholder}
        required={required}
        step={step}
        className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm"
      />
    </div>
  )
}
