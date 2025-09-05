import React from "react";
import BusIcon from "@/svg-icons/bus.svg";
import { BusType } from "@/store/useBusesStore";

type CardProps = {
  bus: BusType;
  onClick: () => void;
};

const BusCard: React.FC<CardProps> = ({ bus, onClick }) => {
  return (
    <button
      className="flex justify-between bg-white border-b border-gray-200 p-4 w-full cursor-pointer"
      onClick={onClick}
    >
      <div className="">
        <div className="flex justify-between items-center ">
          <BusIcon />
          <p className="text-lg text-slate-900 font-semibold ml-2">
            {bus.name}
          </p>
        </div>
        <div className="flex items-center mt-2">
          <span
            className={`rounded-full font-semibold text-xs px-2 py-1 ${bus.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-800"}`}
          >
            {bus.status.toLowerCase()}
          </span>
        </div>
      </div>
      <div className="flex justify-between">
        {/* <button
          className="flex justify-center items-center w-8 h-8"
          onClick={() => {}}
        >
          <EditIcon />
        </button>
        <button
          className="flex justify-center items-center w-8 h-8"
          onClick={() => {}}
        >
          <DeleteIcon />
        </button> */}
      </div>
    </button>
  );
};

export default BusCard;
