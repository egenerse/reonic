import React from "react"
import { ErrorMessage } from "../ErrorMessage"

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  showPercentage: boolean
  label: string
  error?: string
}

export const RangeInput: React.FC<Props> = ({
  label,
  required = false,
  className = "",
  showPercentage = false,
  value,
  min,
  max,
  error,
  ...props
}) => {
  return (
    <div className={className}>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
        <br />
        {value} {showPercentage && "%"}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <div className="w-full">
        <input
          type="range"
          value={value}
          className="h-10 w-full rounded-md"
          min={min}
          max={max}
          {...props}
        />
        <div className="-mt-1 flex justify-between text-xs text-gray-500">
          <div>
            {min}
            {showPercentage && "%"}
          </div>
          <div>
            {max}
            {showPercentage && "%"}
          </div>
        </div>
      </div>
      <ErrorMessage message={error} />
    </div>
  )
}
