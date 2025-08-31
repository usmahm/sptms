import LocationIcon from "@/svg-icons/location.svg";
import RouteIcon from "@/svg-icons/routes-icon.svg";
import ClockIcon from "@/svg-icons/clock.svg";
import EditIcon from "@/svg-icons/edit.svg";
import DeleteIcon from "@/svg-icons/delete.svg";
import { RouteType } from "../Forms/CreateRoute";
import { mTokm, secToMin } from "@/utils/utils";

type CardProps = {
  route: RouteType;
};

const RouteCard: React.FC<CardProps> = ({ route }) => {
  return (
    <div className="flex justify-between bg-white border border-gray-200 rounded-lg p-6">
      <div className="">
        <div className="flex justify-between items-center gap-3">
          <RouteIcon />
          <p className="text-lg text-slate-900 font-semibold">{route.name}</p>
          <p className="text-sm text-slate-500">({route.code})</p>
          <span
            className={`rounded-full font-semibold text-xs px-2 py-1 ${route.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-800"}`}
          >
            {route.status.toLowerCase()}
          </span>
        </div>
        <div className="mt-2 flex items-center">
          <LocationIcon />
          <p className="ml-1.5 text-sm text-slate-600">
            Downtown Terminal → University Campus
          </p>
        </div>
        <div className="flex items-center mt-2">
          <ClockIcon />
          <p className="ml-1.5 text-sm text-slate-600">
            {secToMin(route.duration)} minute
          </p>
          <p className="ml-5 text-sm text-slate-600">
            {mTokm(route.distance)}km
          </p>
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
    </div>
  );
};

export default RouteCard;
