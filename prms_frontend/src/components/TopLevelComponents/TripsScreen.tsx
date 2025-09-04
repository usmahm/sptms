"use client";

import { useEffect, useRef, useState } from "react";
import Button from "../UI/Button/Button";
import CreateTrip, { TripType } from "../Forms/CreateTrip.";
import LoadingSpinner from "../UI/LoadingSpinner/LoadingSpinner";
import MapComponent from "../MapComponent/MapComponent";
import RoutesIcon from "@/svg-icons/routes-icon.svg";
import EditIcon from "@/svg-icons/edit.svg";
import DeleteIcon from "@/svg-icons/delete.svg";
import TripCard from "../Cards/TripCard";
import api, { ApiResponse } from "@/api/api";
import { toast } from "react-toastify";
import { LAT_LNG_TYPE } from "@/types";
import dayjs from "dayjs";
import { RouteType } from "../Forms/CreateRoute";
import { MARKER_PROP_TYPE } from "../CustomMarker/CustomMarker";
import { PLOT_ROUTE_TYPE } from "../PlotRoute/PlotRoute";
import { checkIfBoundContains, mTokm, toLatLngBounds } from "@/utils/utils";

enum VIEW_TYPES {
  LIST,
  FORM
}

// Make this user location
const center = {
  lat: 7.501217,
  lng: 4.502154
};

const TripsDashboard = ({
  trips,
  loading,
  selectedTrip,
  onSelectTrip,
  onStartTrip,
  selectedTripRoute
  // openNewBusForm
}: {
  trips: TripType[];
  loading: boolean;
  onSelectTrip: (bus: TripType) => void;
  onStartTrip: (busId: string) => void;
  selectedTrip?: TripType;
  selectedTripRoute?: RouteType;
  // openNewBusForm: () => void;
}) => {
  let markers: MARKER_PROP_TYPE[] = [];

  if (selectedTripRoute) {
    markers = [
      selectedTripRoute.start_bus_stop,
      selectedTripRoute.end_bus_stop
    ].map((b) => ({
      label: b.name,
      position: b.location
    }));
  }

  if (selectedTrip) {
    markers.push({
      label: selectedTrip.bus.code,
      position: selectedTrip.actual_path[selectedTrip.actual_path.length - 1]
    });
  }

  let routetoPlot: PLOT_ROUTE_TYPE[] = [];
  if (selectedTripRoute) {
    routetoPlot = [
      {
        path: selectedTripRoute.expected_path,
        color: "#008000",
        visible: true
      }
    ];
  }

  // [FIX]!
  let isWithinGeoFence = true;
  if (selectedTrip && selectedTripRoute) {
    const currentLocation =
      selectedTrip.actual_path[selectedTrip.actual_path.length - 1];
    isWithinGeoFence = checkIfBoundContains(
      selectedTripRoute.geo_fence.bound,
      currentLocation
    );
  }

  console.log("HEYYY 1212", isWithinGeoFence, selectedTrip);

  return (
    <div className="grid grid-cols-[329px_1fr] gap-x-6 ">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 p-4 flex justify-between items-center">
          <h3 className="text-slate-900 text-base font-semibold">Trips</h3>
          {/* <Button label="+ Add Bus" onClick={openNewBusForm} /> */}
        </div>

        {loading ? (
          <div className="w-full flex justify-center mt-3">
            <LoadingSpinner />
          </div>
        ) : (
          trips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              selected={trip.id === selectedTrip?.id}
              onClick={() => onSelectTrip(trip)}
              onStartTrip={() => onStartTrip(trip.id)}
            />
          ))
        )}
      </div>

      <div className="bg-white rounded-t-lg border border-gray-200 h-full overflow-hidden">
        <div className="flex justify-between items-center border-b border-gray-200 p-4">
          <h3 className="text-slate-900 text-base font-semibold">
            {selectedTrip?.actual_departure_time
              ? "Live Location"
              : "Trip Route"}
          </h3>

          {selectedTrip?.actual_departure_time && (
            <div className="flex flex-col items-end">
              <p className="text-sm mt-1 text-slate-600">
                Distance from Destination:{" "}
                {selectedTripRoute?.distance
                  ? `${mTokm(selectedTripRoute.distance)}km`
                  : "Unknown"}
              </p>
              <p className="text-sm mt-1 text-slate-600">
                Estimated Arrival Time:{" "}
                {selectedTripRoute?.duration
                  ? dayjs()
                      .add(selectedTripRoute.duration, "second")
                      .format("YYYY-MM-DD - HH:mm")
                  : "Unknown"}
              </p>
            </div>
          )}
        </div>
        <div className="h-100 bg-blue-50">
          {selectedTrip && selectedTripRoute ? (
            <MapComponent
              center={center}
              markers={markers}
              routesToPlot={routetoPlot}
              geofenceBounds={toLatLngBounds(selectedTripRoute.geo_fence.bound)}
              isWithinGeoFence={isWithinGeoFence}
            />
          ) : (
            <div className="h-full w-full flex flex-col justify-center items-center">
              <RoutesIcon />
              <p className="text-base text-slate-500 mt-6">
                Select a bus to view real-time details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TripsScreen = () => {
  const [view, setView] = useState<VIEW_TYPES>(VIEW_TYPES.LIST);
  const [trips, setTrips] = useState<TripType[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<TripType | undefined>(
    undefined
  );
  const [selectedTripRoute, setSelectedTripRoute] = useState<
    RouteType | undefined
  >(undefined);

  const [loadingTrips, setLoadingTrips] = useState(true);
  const [editingTrip, setEditingTrip] = useState<TripType | undefined>(
    undefined
  );
  const tripEvent = useRef<EventSource | null>(null);
  const lastDurationTimeUpdate = useRef<string | null>(null);

  // const [routedistDur, setRoutedistDur] = useState<{
  //   distance: number;
  //   duration: number;
  // } | null>(null);

  const updateArrivalTime = async (currentLocation: LAT_LNG_TYPE) => {
    const isMoreThanOneMin =
      Math.abs(dayjs().diff(dayjs(lastDurationTimeUpdate.current), "minute")) >=
      1;

    if (isMoreThanOneMin && selectedTripRoute) {
      // fetch and update estimated arrival time
      const directionService = new google.maps.DirectionsService();

      const directionResult = await directionService.route({
        origin: currentLocation,
        destination: selectedTripRoute.end_bus_stop.location,
        travelMode: google.maps.TravelMode.DRIVING
      });

      console.log("HEYYY 1111 UPDATING ARRIVAL TIME", directionResult);

      setSelectedTripRoute((pr) => {
        if (!pr) return pr;

        if (
          directionResult?.routes &&
          directionResult.routes[0].legs &&
          directionResult.routes[0].legs[0].distance &&
          directionResult.routes[0].legs[0].duration
        ) {
          const newDistance = directionResult.routes[0].legs[0].distance.value;
          const newDuration = directionResult.routes[0].legs[0].duration.value;

          return {
            ...pr,
            duration: newDuration || pr.duration,
            distance: newDistance || pr.distance
          };
        } else {
          return pr;
        }
      });
    }
  };

  const trackTrip = async (tripId: string) => {
    try {
      if (tripEvent.current) {
        tripEvent.current.close();
        tripEvent.current = null;
      }

      const events = new EventSource(
        `${api.getUri()}/trips/path/events/${tripId}`
      );
      events.onmessage = (event) => {
        console.log("HEYYY event data", event.data);
        const parsedData: LAT_LNG_TYPE[] = JSON.parse(event.data);

        setSelectedTrip((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            actual_path: [...prev.actual_path, ...parsedData]
          };
        });

        updateArrivalTime(parsedData[parsedData.length - 1]);
      };

      tripEvent.current = events;
    } catch {
      toast.error("Unable to track trip, try again!");
    }
  };

  const loadTrips = async () => {
    try {
      const response: ApiResponse<TripType[]> = await api.get("/trips");

      console.log("trips", response);
      if (response.success) {
        setTrips(response.data);
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error("Unable to fetch routes!");
    } finally {
      setLoadingTrips(false);
    }
  };

  const onStartTrip = async (tripId: string) => {
    try {
      const payload = {
        actual_departure_time: dayjs().local().format()
      };

      const response: ApiResponse<TripType[]> = await api.patch(
        `/trips/${tripId}`,
        payload
      );

      if (response.success) {
        const editedTrip = response.data[0];
        setTrips((prev) =>
          prev.map((tr) => {
            if (tr.id === editedTrip.id) {
              return editedTrip;
            }

            return tr;
          })
        );
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error("Unable to fetch routes!");
    } finally {
      setLoadingTrips(false);
    }
  };

  const onSelectTrip = async (trip: TripType) => {
    setSelectedTripRoute(undefined);
    setSelectedTrip(trip);

    if (trip.actual_departure_time && !trip.actual_arrival_time) {
      trackTrip(trip.id);
    }

    try {
      const response: ApiResponse<RouteType> = await api.get(
        `/routes/${trip.route.id}`
      );
      if (response.success) {
        console.log("routes", response);

        setSelectedTripRoute(response.data);
        // setRoutedistDur({
        //   distance: response.data.distance,
        //   duration: response.data.duration
        // });
      } else {
        throw new Error();
      }
    } catch {
      toast.error("Unable to fetch selected trip route");
    }
  };

  useEffect(() => {
    loadTrips();

    return () => {
      if (tripEvent.current) {
        tripEvent.current.close();
        tripEvent.current = null;
      }
    };
  }, []);

  let toRender = (
    <TripsDashboard
      trips={trips}
      loading={loadingTrips}
      selectedTrip={selectedTrip}
      selectedTripRoute={selectedTripRoute}
      onSelectTrip={onSelectTrip}
      onStartTrip={onStartTrip}
    />
  );
  if (view === VIEW_TYPES.FORM) {
    toRender = (
      <CreateTrip
        onCancel={() => setView(VIEW_TYPES.LIST)}
        tripData={editingTrip}
        onCreateTrip={(newTrip) => {
          setTrips((prev) => [newTrip, ...prev]);
          setView(VIEW_TYPES.LIST);
        }}
      />
    );
  }

  return (
    <div className="h-full bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Trips</h1>
          <p className="text-slate-600 text-base">
            Create and manage trips for buses
          </p>
        </div>

        {view === VIEW_TYPES.LIST && (
          <Button
            label="+ Create Trip"
            onClick={() => setView(VIEW_TYPES.FORM)}
          />
        )}
      </div>

      {toRender}
    </div>
  );
};

export default TripsScreen;
