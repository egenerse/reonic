import React from "react";

interface InputFieldProps {
  id: string;
  name: string;
  label: string;
  type?: "text" | "number";
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  placeholder?: string;
  required?: boolean;
  className?: string;
  step?: number;
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
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
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
        className="w-full h-10 px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm "
      />
    </div>
  );
};
