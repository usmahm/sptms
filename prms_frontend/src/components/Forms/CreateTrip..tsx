import { useEffect, useState } from "react";
import MapComponent from "../MapComponent/MapComponent";
import Button from "../UI/Button/Button";
import DropDown, { OptionType } from "../UI/DropDown/DropDown";
import { PLOT_ROUTE_TYPE } from "../PlotRoute/PlotRoute";
import { LAT_LNG_TYPE } from "@/types";
import DateTimeInput from "../UI/Input/DateTimeInput";
import dayjs from "dayjs";
import { useShallow } from "zustand/shallow";
import useTripsStore from "@/store/useTripsStore";
import useRoutesStore from "@/store/useRoutesStore";
import useBusesStore from "@/store/useBusesStore";

const center = {
  lat: 7.501217,
  lng: 4.502154
};

export type TripType = {
  id: string;
  // route: string;
  route: {
    code: string;
    id: string;
    name: string;
    distance: number;
    end_bus_stop: {
      code: string;
      name: string;
    };
    start_bus_stop: {
      code: string;
      name: string;
    };
  };
  actual_arrival_time?: string;
  actual_departure_time?: string;
  actual_path: LAT_LNG_TYPE[];
  bus: {
    code: string;
  };
  scheduled_arrival_time?: string;
  scheduled_departure_time?: string;
};

type CreateGeoFenceType = {
  onCancel: () => void;
  tripData?: TripType;
  onCreateTrip: () => void;
};

const CreateTrip: React.FC<CreateGeoFenceType> = ({
  onCancel,
  onCreateTrip
}) => {
  const { createTripHandler } = useTripsStore(
    useShallow((state) => ({
      createTripHandler: state.createTripHandler
    }))
  );

  const { loadRoutes, routes, loadingRoutes } = useRoutesStore(
    useShallow((state) => ({
      loadRoutes: state.loadRoutes,
      loadingRoutes: state.loadingRoutes,
      routes: state.routes
    }))
  );

  const { buses, loadingBuses, loadBuses } = useBusesStore(
    useShallow((state) => ({
      buses: state.buses,
      loadingBuses: state.loadingBuses,
      loadBuses: state.loadBuses
    }))
  );

  const [bus, setBus] = useState<OptionType | null>(null);
  const [route, setRoute] = useState<OptionType | null>(null);
  const [departureTime, setDepartureTime] = useState(
    "2025-05-21T06:31:39.274Z"
  );
  const [submitting, setSubmitting] = useState(false);

  const onSubmitHandler = async () => {
    const selectedRoute = routes.find((r) => r.id === route?.value);

    if (bus && departureTime && selectedRoute) {
      const tripData = {
        bus: bus.value,
        route: selectedRoute.id,
        scheduled_departure_time: departureTime,
        scheduled_arrival_time: dayjs(departureTime)
          .add(selectedRoute.duration, "second")
          .format()
      };

      await createTripHandler(tripData, onCreateTrip);
    }
  };

  useEffect(() => {
    if (!buses.length) {
      loadBuses();
    }

    if (!routes.length!) {
      loadRoutes();
    }
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
