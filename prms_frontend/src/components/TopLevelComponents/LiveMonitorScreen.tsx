"use client";
import { useEffect, useRef, useState } from "react";
import Button from "../UI/Button/Button";
import EditIcon from "@/svg-icons/edit.svg";
import DeleteIcon from "@/svg-icons/delete.svg";
import LiveMonitorIcon from "@/svg-icons/monitor.svg";
import LoadingSpinner from "../UI/LoadingSpinner/LoadingSpinner";
import MapComponent from "../MapComponent/MapComponent";
import BusCard from "../Cards/BusCard";
import CreateBus, { BusType } from "../Forms/CreateBus";
import api, { ApiResponse } from "@/api/api";
import { toast } from "react-toastify";
import { TripType } from "../Forms/CreateTrip.";
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

const FleetDashboard = ({
  fleet,
  loading,
  selectedBus,
  onSelectBus,
  openNewBusForm
}: {
  fleet: BusType[];
  loading: boolean;
  onSelectBus: (bus: BusType) => void;
  selectedBus?: BusType;
  openNewBusForm: () => void;
}) => {
  return (
    <div className="grid grid-cols-[329px_1fr] gap-x-6 ">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 p-4 flex justify-between items-center">
          <h3 className="text-slate-900 text-base font-semibold">
            Fleet Status
          </h3>
          <Button label="+ Add Bus" onClick={openNewBusForm} />
        </div>

        {loading ? (
          <div className="w-full flex justify-center mt-3">
            <LoadingSpinner />
          </div>
        ) : (
          fleet.map((g) => (
            <BusCard key={g.id} bus={g} onClick={() => onSelectBus(g)} />
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
          {selectedBus ? (
            <MapComponent center={center} />
          ) : (
            <div className="h-full w-full flex flex-col justify-center items-center">
              <LiveMonitorIcon w-64 h-64 />
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

const LiveMonitorScreen = () => {
  const [view, setView] = useState<VIEW_TYPES>(VIEW_TYPES.LIST);
  const [fleet, setFleet] = useState<BusType[]>([]);
  // const [tripData, setTripData] = useState<LAT_LNG_TYPE[]>([]);
  // const tripEvent = useRef<EventSource | null>(null);

  const [loadingFleet, setLoadingFleet] = useState(true);
  const [editingBus, setEditingBus] = useState<BusType | undefined>(undefined);

  const [selectedBus, setSelectedBus] = useState<BusType | undefined>(
    undefined
  );

  const loadFleet = async () => {
    try {
      const response: ApiResponse<BusType[]> = await api.get("/bus-nodes");

      // console.log("fleet", response);
      if (response.success) {
        setFleet(response.data);
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error("Unable to load buses!");
    } finally {
      setLoadingFleet(false);
    }
  };

  useEffect(() => {
    loadFleet();

    // return () => {
    //   if (tripEvent.current) {
    //     tripEvent.current.close();
    //     tripEvent.current = null;
    //   }
    // };
  }, []);

  // const trackTrip = async (tripId: string) => {
  //   try {
  //     if (tripEvent.current) {
  //       tripEvent.current.close();
  //       tripEvent.current = null;
  //     }

  //     const events = new EventSource(
  //       `${api.getUri()}/trips/path/events/${tripId}`
  //     );
  //     events.onmessage = (event) => {
  //       // console.log("HEYYY resp", event);
  //       const parsedData: LAT_LNG_TYPE[] = JSON.parse(event.data);

  //       setTripData((prev) => [...prev, ...parsedData]);
  //     };

  //     tripEvent.current = events;
  //   } catch {
  //     toast.error("Unable to track trip, try again!");
  //   }
  // };

  let toRender = (
    <FleetDashboard
      fleet={fleet}
      loading={loadingFleet}
      selectedBus={selectedBus}
      onSelectBus={(b) => {
        setSelectedBus(b);
      }}
      openNewBusForm={() => setView(VIEW_TYPES.FORM)}
    />
  );

  if (view === VIEW_TYPES.FORM) {
    toRender = (
      <CreateBus
        onCancel={() => setView(VIEW_TYPES.LIST)}
        busData={editingBus}
        onCreateBus={(newBus) => {
          setFleet((prev) => [newBus, ...prev]);
          setView(VIEW_TYPES.LIST);
        }}
      />
    );
  }

  return (
    <div className="h-full bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Real-Time Monitoring
          </h1>
          <p className="text-slate-600 text-base">
            Track bus locations and status in real-time
          </p>
        </div>

        {/* {view === VIEW_TYPES.LIST && (
          <Button
            label="+ Create Geofence"
            onClick={() => setView(VIEW_TYPES.FORM)}
          />
        )} */}
      </div>

      {toRender}
    </div>
  );
};

export default LiveMonitorScreen;
