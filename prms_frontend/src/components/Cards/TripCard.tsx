import LocationIcon from "@/svg-icons/location.svg";
import RouteIcon from "@/svg-icons/routes-icon.svg";
import ClockIcon from "@/svg-icons/clock.svg";
import EditIcon from "@/svg-icons/edit.svg";
import DeleteIcon from "@/svg-icons/delete.svg";
import { RouteType } from "../Forms/CreateRoute";
import { mTokm, secToMin } from "@/utils/utils";
import { TripType } from "../Forms/CreateTrip.";
import Button from "../UI/Button/Button";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(timezone);

type CardProps = {
  trip: TripType;
  selected: boolean;
  onClick: () => void;
  onStartTrip: () => void;
};

const TripCard: React.FC<CardProps> = ({
  trip,
  onClick,
  onStartTrip,
  selected
}) => {
  let status = "Scheduled";
  if (trip.actual_departure_time && !trip.actual_arrival_time) {
    status = "Ongoing";
  } else if (trip.actual_departure_time && trip.actual_arrival_time) {
    status = "Completed";
  }

  const dateTimeString = `${dayjs(trip.scheduled_departure_time).local().format("YYYY-MM-DD")} - ${dayjs(trip.scheduled_departure_time).local().format("HH:mm")} to ${dayjs(trip.scheduled_arrival_time).local().format("HH:mm")}`;

  return (
    <button
      className={`flex justify-betwee border-b border-gray-200 p-4 w-full cursor-pointer ${selected ? "bg-blue-50" : "bg-white"}`}
      onClick={onClick}
    >
      <div className="flex flex-col items-start">
        <div className="flex items-center">
          <p className="text-base text-slate-500">BUS: {trip.bus.code}</p>
          <span
            className={`rounded-full ml-2 font-semibold text-[10px] px-1 py-0.5 ${status == "Ongoing" || status == "Scheduled" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-800"}`}
          >
            {status}
          </span>
        </div>
        <div className="mt-2 flex items-center">
          {/* <LocationIcon /> */}
          <RouteIcon />

          <p className="ml-1.5 text-sm text-slate-600">
            {`${trip.route.start_bus_stop.name} -> ${trip.route.end_bus_stop.name}`}
          </p>
        </div>
        <div className="flex items-center mt-1">
          <ClockIcon />
          <p className="ml-1.5 text-sm text-slate-600">{dateTimeString}</p>
        </div>
        <p className="text-sm mt-1 text-slate-600">
          Distance {mTokm(trip.route.distance)}km
        </p>
      </div>
      <div className="flex flex-col">
        {!trip.actual_departure_time && (
          // <Button label="Begin" onClick={onStartTrip} />
          <button
            className="text-xs text-slate-900 font-semibold underline"
            onClick={onStartTrip}
          >
            Begin
          </button>
        )}
        {/* <div className="flex justify-between"> */}
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
        {/* </div> */}
      </div>
    </button>
  );
};

export default TripCard;
