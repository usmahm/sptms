import { useEffect, useState } from "react";
import MapComponent from "../MapComponent/MapComponent";
import Button from "../UI/Button/Button";
import DropDown, { OptionType } from "../UI/DropDown/DropDown";
import Input from "../UI/Input/Input";
import { BusType } from "./CreateBus";
import { RouteType } from "./CreateRoute";
import api, { ApiResponse } from "@/api/api";
import { toast } from "react-toastify";
import { PLOT_ROUTE_TYPE } from "../PlotRoute/PlotRoute";
import { LAT_LNG_TYPE } from "@/types";
import DateTimeInput from "../UI/Input/DateTimeInput";

const center = {
  lat: 7.501217,
  lng: 4.502154
};

export type TripType = {
  id: string;
  route: string;
  actual_arrival_time?: string;
  actual_departure_time?: string;
  actual_path: LAT_LNG_TYPE[];
  bus: string;
  scheduled_arrival_time?: string;
  scheduled_departure_time?: string;
};

type CreateGeoFenceType = {
  onCancel: () => void;
  tripData?: TripType;
  onCreateTrip: (newTrip: TripType) => void;
};

const CreateTrip: React.FC<CreateGeoFenceType> = ({
  onCancel,
  onCreateTrip
}) => {
  const [loadingRoutes, setLoadingRoutes] = useState(true);
  const [loadingBuses, setLoadingBuses] = useState(true);
  const [buses, setBuses] = useState<BusType[]>([]);
  const [bus, setBus] = useState<OptionType | null>(null);
  const [route, setRoute] = useState<OptionType | null>(null);
  const [routes, setRoutes] = useState<RouteType[]>([]);
  const [departureTime, setDepartureTime] = useState(
    "2025-05-21T06:31:39.274Z"
  );
  const [submitting, setSubmitting] = useState(false);

  const onSubmitHandler = async () => {
    try {
      setSubmitting(true);

      if (bus && departureTime && route) {
        const tripData = {
          bus: bus.value,
          route: route.value,
          scheduled_departure_time: departureTime
        };

        console.log("HEYYY 1212", tripData);

        const response: ApiResponse<TripType[]> = await api.post(
          "/trips",
          tripData
        );

        // console.log("routeData", response);
        if (response.success) {
          toast.success("Trip Created Successfully!");
          onCreateTrip(response.data[0]);
        } else {
          throw new Error();
        }
      }
    } catch {
      toast.error("Unable to create Trip!");
    } finally {
      setSubmitting(false);
    }
  };

  const loadBuses = async () => {
    try {
      const response: ApiResponse<BusType[]> = await api.get("/bus-nodes");

      console.log("fleet", response);
      if (response.success) {
        setBuses(response.data);
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error("Unable to load buses!");
    } finally {
      setLoadingBuses(false);
    }
  };

  const loadRoutes = async () => {
    try {
      const response: ApiResponse<RouteType[]> = await api.get("/routes");
      if (response.success) {
        setRoutes(response.data);
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error("Unable to fetch routes, please reload!");
    } finally {
      setLoadingRoutes(false);
    }
  };

  useEffect(() => {
    loadBuses();
    loadRoutes();
  }, []);

  let routesToPlot: PLOT_ROUTE_TYPE[] = [];
  if (route) {
    const routeData = routes.find((r) => (r.id = route.value));

    if (routeData) {
      routesToPlot = [
        {
          origin: routeData.expected_path[0],
          originLabel: "Origin",
          destination:
            routeData.expected_path[routeData.expected_path.length - 1],
          destinationLabel: "Destination",
          path: routeData.expected_path,
          color: "#166534",
          visible: true
        }
      ];
    }
  }

  let done = false;
  if (bus && departureTime && route) done = true;
  return (
    <div>
      <p className="text-xl font-semibold mb-4">Create New Geofence</p>

      <div>
        <div className="flex gap-4">
          <DropDown
            label="Choose Route"
            value={route ? route.label : ""}
            placeholder="Select route"
            disabled={loadingRoutes || !routes.length}
            options={routes.map((r) => ({
              label: r.name,
              value: r.id
            }))}
            onClick={(v) => setRoute(v)}
          />

          <DropDown
            label="Choose Bus"
            value={bus ? bus.label : ""}
            placeholder="Select bus"
            disabled={loadingBuses || !buses.length}
            options={buses.map((r) => ({
              label: r.name,
              value: r.id
            }))}
            onClick={(v) => setBus(v)}
          />
        </div>

        <div className="flex gap-4 mt-4">
          <DateTimeInput
            id="departureTime"
            value={departureTime}
            onChange={(v) => setDepartureTime(v)}
            label="Scheduled Departure Time"
          />
        </div>
        <div className="h-80 border border-gray-200 rounded-lg mt-4">
          <MapComponent
            center={center}
            // markers={markers}
            routesToPlot={routesToPlot}
          />
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <Button
          label="Create Trip"
          onClick={onSubmitHandler}
          disabled={!done}
          loading={submitting}
        />
        <Button label="Cancel" onClick={onCancel} />
      </div>
    </div>
  );
};

export default CreateTrip;
