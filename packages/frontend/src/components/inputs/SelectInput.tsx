import React from "react";

interface Option {
  value: number;
  label: string;
}

interface SelectInputProps {
  id: string;
  label: string;
  name: string;
  value: number;
  options: Option[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const SelectInput: React.FC<SelectInputProps> = ({
  id,
  label,
  name,
  value,
  options,
  onChange,
}) => {
  return (
    <div className="flex flex-col ">
      <label htmlFor={id} className="mb-1 text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="h-10 px-3 py-2 border border-gray-300 bg-white rounded-md "
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
