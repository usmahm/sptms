import LocationIcon from "@/svg-icons/location.svg";
import LocationIcon2 from "@/svg-icons/location-2.svg";
import EditIcon from "@/svg-icons/edit.svg";
import DeleteIcon from "@/svg-icons/delete.svg";
import { BusStopType } from "../Forms/CreateBusStop";

type CardProps = {
  busStop: BusStopType;
};

const BusStopCard: React.FC<CardProps> = ({ busStop }) => {
  return (
    <div className="flex justify-between bg-white border border-gray-200 rounded-lg p-6">
      <div className="">
        <div className="flex justify-between items-center gap-3">
          <LocationIcon />
          <p className="text-lg text-slate-900 font-semibold">{busStop.name}</p>
          <p className="text-sm text-slate-500">({busStop.code})</p>
          <span
            className={`rounded-full font-semibold text-xs px-2 py-1 ${busStop.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-800"}`}
          >
            {busStop.status.toLowerCase()}
          </span>
        </div>
        <div className="mt-2 flex items-center">
          <LocationIcon2 />
          <p className="ml-1.5 text-sm text-slate-500">{`${busStop.location.lat}, ${busStop.location.lng}`}</p>
        </div>
        <p className="mt-1 text-sm text-slate-500">Routes: A1, B2, C3</p>
      </div>
      <div className="flex justify-between">
        <button
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
        </button>
      </div>
    </div>
  );
};

export default BusStopCard;
