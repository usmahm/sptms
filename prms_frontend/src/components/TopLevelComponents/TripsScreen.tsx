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
  onSelectTrip
  // openNewBusForm
}: {
  trips: TripType[];
  loading: boolean;
  onSelectTrip: (bus: TripType) => void;
  selectedTrip?: TripType;
  // openNewBusForm: () => void;
}) => {
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
              onClick={() => onSelectTrip(trip)}
            />
          ))
        )}
      </div>

      <div className="bg-white rounded-t-lg border border-gray-200 h-full overflow-hidden">
        <div className="flex justify-between items-center border-b border-gray-200 p-4">
          <h3 className="text-slate-900 text-base font-semibold">
            Live Location
          </h3>

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
        <div className="h-100 bg-blue-50">
          {selectedTrip ? (
            <MapComponent center={center} />
          ) : (
            <div className="h-full w-full flex flex-col justify-center items-center">
              <RoutesIcon w-64 h-64 />
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

  const [loadingTrips, setLoadingTrips] = useState(true);
  const [editingTrip, setEditingTrip] = useState<TripType | undefined>(
    undefined
  );
  const tripEvent = useRef<EventSource | null>(null);

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
      onSelectTrip={(t) => {
        setSelectedTrip(t);
        trackTrip(t.id);
      }}
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
