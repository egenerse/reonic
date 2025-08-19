import React from "react"

interface Option {
  value: number
  label: string
}

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: Option[]
}

export const SelectInput: React.FC<Props> = ({
  id,
  label,
  name,
  value,
  options,
  onChange,
  ...props
}) => {
  return (
    <div className="flex flex-col">
      <div className="mb-1 text-sm font-medium text-gray-700">{label}</div>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="h-10 rounded-md border border-gray-300 bg-white px-3 py-2"
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
