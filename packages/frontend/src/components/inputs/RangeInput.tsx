import React from "react"

interface InputFieldProps {
  id: string
  name: string
  label: string
  value: string | number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  min: number
  max: number
  step: number
  percentage?: boolean
  required?: boolean
  className?: string
}

export const RangeInput: React.FC<InputFieldProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  min,
  max,
  step,
  required = false,
  className = "",
  percentage = false,
}) => {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-1 block text-sm font-medium text-gray-700"
      >
        {label}
        <br />
        {value} {percentage && "%"}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <div className="w-full">
        <input
          type="range"
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
          className="h-10 w-full rounded-md"
        />
        <div className="-mt-1 flex justify-between text-xs text-gray-500">
          <div>
            {min}
            {percentage && "%"}
          </div>
          <div>
            {max}
            {percentage && "%"}
          </div>
        </div>
      </div>
    </div>
  )
}
