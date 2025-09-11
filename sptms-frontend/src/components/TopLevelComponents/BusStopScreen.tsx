"use client";

import Button from "@/components/UI/Button/Button";
import { useEffect, useState } from "react";
import CreateBusStop from "../Forms/CreateBusStop";
import LoadingSpinner from "../UI/LoadingSpinner/LoadingSpinner";
import BusStopCard from "../Cards/BusStopCard";
import useBusStopsStore from "@/store/useBusStopsStore";
import { useShallow } from "zustand/shallow";

enum VIEW_TYPES {
  LIST,
  FORM
}

const BusStopList = () => {
  const { busStops, loadingBusStops } = useBusStopsStore(
    useShallow((state) => ({
      busStops: state.busStops,
      loadingBusStops: state.loadingBusStops
    }))
  );

  if (loadingBusStops) {
    return (
      <div className="w-full flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-4">
      {busStops.map((b) => (
        <BusStopCard key={b.id} busStop={b} />
      ))}
    </div>
  );
};

const BusStopScreen = () => {
  const { busStops, loadBusStops, editingBusStop } = useBusStopsStore(
    useShallow((state) => ({
      loadBusStops: state.loadBusStops,
      busStops: state.busStops,
      editingBusStop: state.editingBusStop
    }))
  );
  const [view, setView] = useState<VIEW_TYPES>(VIEW_TYPES.LIST);

  useEffect(() => {
    if (!busStops.length) {
      loadBusStops();
    }
  }, [busStops, loadBusStops]);

  let toRender = <BusStopList />;
  if (view === VIEW_TYPES.FORM) {
    toRender = (
      <CreateBusStop
        busStopData={editingBusStop}
        onCancel={() => setView(VIEW_TYPES.LIST)}
        onCreateBusStop={() => {
          setView(VIEW_TYPES.LIST);
        }}
      />
    );
  }

  return (
    <div className="h-full bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Bus Stops</h1>
          <p className="text-slate-600 text-base">
            Manage bus stop locations and information
          </p>
        </div>

        {view === VIEW_TYPES.LIST && (
          <Button
            label="+ Add Bus Stop"
            onClick={() => setView(VIEW_TYPES.FORM)}
          />
        )}
      </div>
      {toRender}
    </div>
  );
};

export default BusStopScreen;
