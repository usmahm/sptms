import { useState } from "react";

export type OptionType = {
  value: string;
  label: string;
};

type DropDownType = {
  label: string;
  value: string;
  placeholder: string;
  disabled?: boolean;
  options: OptionType[];
  onClick: (option: OptionType) => void;
};

const DropDown = ({
  label,
  value,
  options,
  onClick,
  placeholder,
  disabled
}: DropDownType) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="relative flex-1 flex flex-col">
      <span className="font-semibold text-sm text-slate-900">{label}</span>
      <button
        className="bg-white border border-gray-200 rounded-lg mt-1 h-10 pl-3 text-sm text-left cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
        disabled={disabled}
      >
        {value || placeholder}
      </button>

      {isOpen && (
        <ul className="z-50 bg-white rounded-b-lg border border-gray-200 absolute w-full top-full">
          {options.map((option) => (
            <li
              className="border-b border-gray-200 h-10 flex"
              key={option.label}
            >
              <button
                className="pl-3 h-full w-full text-left text-sm cursor-pointer"
                onClick={() => {
                  onClick(option);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropDown;
