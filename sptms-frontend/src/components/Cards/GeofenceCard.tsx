import LocationIcon from "@/svg-icons/location.svg";
import RouteIcon from "@/svg-icons/routes-icon.svg";
import ClockIcon from "@/svg-icons/clock.svg";
import EditIcon from "@/svg-icons/edit.svg";
import DeleteIcon from "@/svg-icons/delete.svg";
import { GEOFENCE_TYPES } from "../Forms/CreateGeofence";
import { GeofenceType } from "@/store/useGeofenceStore";

type CardProps = {
  geoFence: GeofenceType;
  onClick: () => void;
};

const GeofenceCard: React.FC<CardProps> = ({ geoFence, onClick }) => {
  return (
    <button
      className="flex justify-between bg-white border-b border-gray-200 p-4 w-full cursor-pointer"
      onClick={onClick}
    >
      <div className="">
        <div className="flex justify-between items-center gap-3">
          <p className="text-lg text-slate-900 font-semibold">
            {geoFence.name}
          </p>
        </div>
        {/* <div className="mt-2 flex items-center">
          <RouteIcon />
          <p className="ml-1.5 text-sm text-slate-600">{geoFence.route}</p>
        </div> */}
        <div className="flex items-center mt-2">
          {/* <ClockIcon /> */}
          <span
            className={`rounded-full font-semibold text-xs px-2 py-1 ${geoFence.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-800"}`}
          >
            {geoFence.status.toLowerCase()}
          </span>
          <p className="ml-1.5 text-sm text-slate-600">
            {GEOFENCE_TYPES[geoFence.type].label}
          </p>
        </div>
      </div>
      <div className="flex justify-between">
        {/* <button
          className="flex justify-center items-center w-8 h-8"
          onClick={() => {}}8
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

export default GeofenceCard;
