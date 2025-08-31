"use client";

import Button from "@/components/UI/Button/Button";
import LocationIcon from "@/svg-icons/location.svg";
import LocationIcon2 from "@/svg-icons/location-2.svg";
import EditIcon from "@/svg-icons/edit.svg";
import DeleteIcon from "@/svg-icons/delete.svg";
import { useEffect, useState } from "react";
import CreateBusStop, { BusStopType } from "../Forms/CreateBusStop";
import { toast } from "react-toastify";
import api, { ApiResponse } from "@/api/api";
import { BUS_STOP_TYPE } from "@/types";
import LoadingSpinner from "../UI/LoadingSpinner/LoadingSpinner";
import BusStopCard from "../Cards/BusStopCard";

enum VIEW_TYPES {
  LIST,
  FORM
}

const BusStopList = ({
  busStops,
  loading
}: {
  busStops: BusStopType[];
  loading: boolean;
}) => {
  if (loading) {
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
  const [view, setView] = useState<VIEW_TYPES>(VIEW_TYPES.LIST);
  const [busStops, setBusStops] = useState<BusStopType[]>([]);
  const [editingBusStop, setEditingBusStop] = useState<BusStopType | undefined>(
    undefined
  );
  const [loadingBusStops, setLoadingBusStops] = useState(true);

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

  let toRender = <BusStopList busStops={busStops} loading={loadingBusStops} />;
  if (view === VIEW_TYPES.FORM) {
    toRender = (
      <CreateBusStop
        busStopData={editingBusStop}
        onCancel={() => setView(VIEW_TYPES.LIST)}
        onCreateBusStop={(newBusStop) => {
          setBusStops((prev) => [newBusStop, ...prev]);
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
