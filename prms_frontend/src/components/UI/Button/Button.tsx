import React from "react";

type ButtonPropType = {
  onClick: () => void;
  label: string;
  mode?: "FILL" | "OUTLINE";
  disabled?: boolean;
};

const Button: React.FC<ButtonPropType> = ({
  onClick,
  label,
  disabled,
  mode = "OUTLINE",
}) => (
  <button
    className={`px-5 py-3 rounded-xl border-2 cursor-pointer font-bold border-black 
      ${mode === "OUTLINE" ? "text-black" : "text-white bg-black"} 
      ${disabled && "opacity-30"}
    `}
    onClick={onClick}
    disabled={disabled}
  >
    {label}
  </button>
);

export default Button;
