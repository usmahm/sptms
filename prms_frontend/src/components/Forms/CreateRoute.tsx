import Input from "@/components/UI/Input/Input";
import Button from "@/components/UI/Button/Button";
import DropDown, { OptionType } from "../UI/DropDown/DropDown";
import MapComponent, { ACTION_TYPES } from "../MapComponent/MapComponent";
import { MARKER_PROP_TYPE } from "../CustomMarker/CustomMarker";
import { LAT_LNG_TYPE } from "@/types";
import React, { useEffect, useState } from "react";
import api, { ApiResponse } from "@/api/api";
import { toast } from "react-toastify";
import { PLOT_ROUTE_TYPE } from "../PlotRoute/PlotRoute";
import { mTokm, secToMin } from "@/utils/utils";
import { BusStopType } from "./CreateBusStop";

// Make this user location
const center = {
  lat: 7.501217,
  lng: 4.502154
};

const statusOptions = [
  { label: "Inactive", value: "INACTIVE" },
  { label: "Active", value: "ACTIVE" }
];

export type RouteType = {
  name: string;
  code: string;
  start_bus_stop: string;
  end_bus_stop: string;
  expected_path: {
    lat: string;
    lng: string;
  }[];
  duration: number;
  distance: number;
  id: string;
  status: string;
};

type CreateRouteType = {
  onCancel: () => void;
  routeData?: RouteType;
  onCreateRoute: (newRoute: RouteType) => void;
};

const CreateRoute: React.FC<CreateRouteType> = ({
  onCancel,
  routeData,
  onCreateRoute
}) => {
  const [fetchedRoute, setFetchedRoute] = useState<
    google.maps.DirectionsResult | undefined
  >(undefined);
  const [startStop, setStartStop] = useState<BusStopType | null>(null);
  const [endStop, setEndStop] = useState<BusStopType | null>(null);
  const [routedistDur, setRoutedistDur] = useState<{
    distance: number;
    duration: number;
  } | null>(null);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<OptionType | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [busStops, setBusStops] = useState<BusStopType[]>([]);
  const [loadingBusStops, setLoadingBusStops] = useState(true);
  const [loadingRoute, setLoadingRoute] = useState(false);

  const onSubmitHandler = async () => {
    try {
      setSubmitting(true);

      if (
        name &&
        code &&
        startStop &&
        endStop &&
        status &&
        routedistDur &&
        fetchedRoute
      ) {
        const routeData = {
          name,
          code,
          status: status.value,
          start_bus_stop: startStop.id,
          end_bus_stop: endStop.id,
          expected_path: fetchedRoute.routes[0].overview_path.map((r) =>
            r.toJSON()
          ),
          duration: routedistDur.duration,
          distance: routedistDur.distance
        };

        const response: ApiResponse<RouteType[]> = await api.post(
          "/routes",
          routeData
        );

        // console.log("routeData", response);
        if (response.success) {
          toast.success("Route Created Successfully!");
          onCreateRoute(response.data[0]);
        } else {
          throw new Error();
        }
      }
    } catch (err) {
      toast.error("Unable to create Route!");
    } finally {
      setSubmitting(false);
    }
  };

  const fetchRouteHandler = async () => {
    try {
      setLoadingRoute(true);
      setFetchedRoute(undefined);

      if (endStop && startStop) {
        const directionService = new google.maps.DirectionsService();

        const directionResult = await directionService.route({
          origin: startStop.location,
          destination: endStop.location,
          travelMode: google.maps.TravelMode.DRIVING
        });

        // @ts-expect-error: this library's type definition is not completely correct
        if (directionResult.status === "OK") {
          setFetchedRoute(directionResult);
          if (
            directionResult?.routes &&
            directionResult.routes[0].legs &&
            directionResult.routes[0].legs[0].distance &&
            directionResult.routes[0].legs[0].duration
          ) {
            // [FIX]!: temporary hack
            setRoutedistDur({
              distance: directionResult.routes[0].legs[0].distance.value,
              duration: directionResult.routes[0].legs[0].duration.value
            });
          }
        } else {
          throw new Error();
        }
      }
    } catch (err) {
      toast.error("Error fetching route!");
    } finally {
      setLoadingRoute(false);
    }
  };

  useEffect(() => {
    if (startStop && endStop) {
      fetchRouteHandler();
    }
  }, [startStop, endStop]);

  const loadBusStops = async () => {
    try {
      const response: ApiResponse<BusStopType[]> = await api.get("/bus-stops");
      if (response.success) {
        // console.log("busStopData", response);

        setBusStops(response.data);
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error("Unable to fetch bus stops!");
    } finally {
      setLoadingBusStops(false);
    }
  };

  useEffect(() => {
    loadBusStops();
  }, []);

  let markers: MARKER_PROP_TYPE[] = busStops.map((b) => ({
    label: b.name,
    position: b.location,
    onClick: () => {
      if (!startStop) {
        setStartStop(b);
      } else {
        setEndStop(b);
      }
    }
  }));

  let routetoPlot: PLOT_ROUTE_TYPE[] = [];
  if (fetchedRoute) {
    routetoPlot = [
      {
        path: fetchedRoute.routes[0].overview_path.map((r) => r.toJSON()),
        color: "#008000",
        visible: true
      }
    ];
  }

  let done = false;
  if (
    name &&
    code &&
    startStop &&
    endStop &&
    status &&
    routedistDur &&
    fetchedRoute
  )
    done = true;
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <p className="text-xl font-semibold mb-4">Add New Bus Stop</p>

      <div>
        <div className="flex gap-4">
          <Input
            id="name"
            value={name}
            onChange={(v) => setName(v)}
            label="Route Name"
          />
          <Input
            id="code"
            value={code}
            onChange={(v) => setCode(v)}
            label="Route Code"
          />
        </div>
        <div className="flex gap-4 mt-4">
          <Input
            id="start"
            label="Start Stop"
            disabled
            placeholder={
              startStop
                ? `lat: ${startStop.location.lat}, lng: ${startStop.location.lng}`
                : "Select start stop on map"
            }
            value={``}
            onChange={() => {}}
          />
          <Input
            id="end"
            label="End Stop"
            disabled
            placeholder={
              startStop
                ? `${endStop ? `lat: ${endStop.location.lat}, lng: ${endStop.location.lng}` : "Select end stop on map"}`
                : "Please Select Start Stop on map"
            }
            onChange={() => {}}
            value={``}
          />
        </div>
        {startStop && (
          <div className="h-4 flex items-center">
            <button
              className="text-xs font-bold text-red-800 underline cursor-pointer"
              onClick={() => {
                setStartStop(null);
                setEndStop(null);
              }}
            >
              Clear Stops
            </button>
            {loadingRoute && (
              <p className="text-xs ml-2 font-bold text-green-700">
                Loading route...
              </p>
            )}
          </div>
        )}
        <div className="flex gap-4 mt-4">
          <Input
            id="duration"
            label="Duration (minutes)"
            onChange={() => {}}
            disabled
            placeholder="Select start and end stop to fill"
            value={routedistDur ? `${secToMin(routedistDur.duration)}` : ""}
          />
          <Input
            id="distance"
            label="Distance (km)"
            onChange={() => {}}
            disabled
            placeholder="Select start and end stop to fill"
            value={routedistDur ? `${mTokm(routedistDur.distance)}` : ""}
          />
          <DropDown
            label="Status"
            value={status ? status.label : ""}
            placeholder="Select Status"
            options={statusOptions}
            onClick={(v) => setStatus(v)}
          />
        </div>
        <div className="h-80 border border-gray-200 rounded-lg mt-4">
          <MapComponent
            center={center}
            actionMode={ACTION_TYPES.SELECT_POINT}
            markers={markers}
            routesToPlot={routetoPlot}
          />
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <Button
          label="Create Route"
          onClick={onSubmitHandler}
          disabled={!done}
          loading={submitting}
        />
        <Button label="Cancel" onClick={onCancel} />
      </div>
    </div>
  );
};

export default CreateRoute;
