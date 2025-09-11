import React from "react";

type InputProps = {
  id: string;
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  disabled,
  id,
  onChange,
  value
}) => {
  return (
    <div className="flex-1 flex flex-col">
      <label htmlFor={id} className="font-semibold text-sm text-slate-900">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type="text"
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        value={value}
        className="bg-white border border-gray-200 rounded-lg mt-1 h-10 pl-3 text-sm"
      />
    </div>
  );
};

export default Input;
