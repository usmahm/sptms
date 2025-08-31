import LocationIcon from "@/svg-icons/location.svg";
import RouteIcon from "@/svg-icons/routes-icon.svg";
import ClockIcon from "@/svg-icons/clock.svg";
import EditIcon from "@/svg-icons/edit.svg";
import DeleteIcon from "@/svg-icons/delete.svg";
import { RouteType } from "../Forms/CreateRoute";
import { mTokm, secToMin } from "@/utils/utils";
import { TripType } from "../Forms/CreateTrip.";

type CardProps = {
  trip: TripType;
  onClick: () => void;
};

const TripCard: React.FC<CardProps> = ({ trip, onClick }) => {
  return (
    <button
      className="flex justify-between bg-white border-b border-gray-200 p-4 w-full cursor-pointer"
      onClick={onClick}
    >
      <div className="">
        <div className="flex justify-between items-center gap-3">
          <RouteIcon />
          <p className="text-lg text-slate-900 font-semibold">
            {trip.id.slice(0, 6)}
          </p>
          <p className="text-sm text-slate-500">({trip.bus.slice(0, 6)})</p>
          <span
            className={`rounded-full font-semibold text-xs px-2 py-1 ${trip ? "bg-green-100 text-green-700" : "bg-red-100 text-red-800"}`}
          >
            {/* {trip.status.toLowerCase()} */}
            {trip.actual_arrival_time}
          </span>
        </div>
        <div className="mt-2 flex items-center">
          <LocationIcon />
          <p className="ml-1.5 text-sm text-slate-600">
            {trip.route.slice(0, 6)}
          </p>
        </div>
        <div className="flex items-center mt-2">
          <ClockIcon />
          <p className="ml-1.5 text-sm text-slate-600">{10} minute</p>
          <p className="ml-5 text-sm text-slate-600">{100}km</p>
        </div>
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
    </button>
  );
};

export default TripCard;
