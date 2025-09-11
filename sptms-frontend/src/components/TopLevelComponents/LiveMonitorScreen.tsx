"use client";
import { useEffect, useState } from "react";
import Button from "../UI/Button/Button";
import EditIcon from "@/svg-icons/edit.svg";
import DeleteIcon from "@/svg-icons/delete.svg";
import LiveMonitorIcon from "@/svg-icons/monitor.svg";
import LoadingSpinner from "../UI/LoadingSpinner/LoadingSpinner";
import MapComponent from "../MapComponent/MapComponent";
import BusCard from "../Cards/BusCard";
import CreateBus from "../Forms/CreateBus";
import { MARKER_PROP_TYPE } from "../CustomMarker/CustomMarker";
import useBusesStore, { BusType } from "@/store/useBusesStore";
import { useShallow } from "zustand/shallow";

enum VIEW_TYPES {
  LIST,
  FORM
}

// Make this user location
const center = {
  lat: 7.501217,
  lng: 4.502154
};

const FleetDashboard = ({ openNewBusForm }: { openNewBusForm: () => void }) => {
  const { loadingBuses, buses, selectedBus, selectBusHandler } = useBusesStore(
    useShallow((state) => ({
      buses: state.buses,
      loadingBuses: state.loadingBuses,
      selectedBus: state.selectedBus,
      selectBusHandler: state.selectBusHandler
    }))
  );

  let markers: MARKER_PROP_TYPE[] = [];
  if (selectedBus && selectedBus.location) {
    markers = [
      {
        label: selectedBus.name,
        position: selectedBus.location
      }
    ];
  }

  return (
    <div className="grid grid-cols-[329px_1fr] gap-x-6 ">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 p-4 flex justify-between items-center">
          <h3 className="text-slate-900 text-base font-semibold">
            Fleet Status
          </h3>
          <Button label="+ Add Bus" onClick={openNewBusForm} />
        </div>

        {loadingBuses ? (
          <div className="w-full flex justify-center mt-3">
            <LoadingSpinner />
          </div>
        ) : (
          buses.map((g) => (
            <BusCard key={g.id} bus={g} onClick={() => selectBusHandler(g)} />
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
            <MapComponent center={center} markers={markers} />
          ) : (
            <div className="h-full w-full flex flex-col justify-center items-center">
              <LiveMonitorIcon />
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
  const { buses, editingBus, loadBuses } = useBusesStore(
    useShallow((state) => ({
      buses: state.buses,
      editingBus: state.editingBus,
      loadBuses: state.loadBuses
    }))
  );
  const [view, setView] = useState<VIEW_TYPES>(VIEW_TYPES.LIST);

  useEffect(() => {
    if (!buses.length) {
      loadBuses();
    }
  }, []);

  let toRender = (
    <FleetDashboard openNewBusForm={() => setView(VIEW_TYPES.FORM)} />
  );

  if (view === VIEW_TYPES.FORM) {
    toRender = (
      <CreateBus
        onCancel={() => setView(VIEW_TYPES.LIST)}
        busData={editingBus}
        onCreateBus={() => {
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
      </div>

      {toRender}
    </div>
  );
};

export default LiveMonitorScreen;
