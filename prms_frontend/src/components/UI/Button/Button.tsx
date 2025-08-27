import React from "react";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

type ButtonPropType = {
  onClick: () => void;
  label: string;
  loading?: boolean;
  mode?: "FILL" | "OUTLINE";
  disabled?: boolean;
};

const Button: React.FC<ButtonPropType> = ({
  onClick,
  label,
  disabled,
  loading,
  mode = "OUTLINE"
}) => (
  <button
    className={`px-5 py-3 rounded-xl border-2 cursor-pointer font-bold border-black  relative
      ${mode === "OUTLINE" ? "text-black" : "text-white bg-black"} 
      ${disabled && "opacity-30"}
    `}
    onClick={onClick}
    disabled={disabled}
  >
    <p className="opacity-0">{label}</p>
    <span className="absolute w-full h-full flex justify-center items-center top-0 left-0">
      {!loading ? label : <LoadingSpinner />}
    </span>
  </button>
);

export default Button;
