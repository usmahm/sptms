// import { BusStopType } from "@/components/Forms/CreateBusStop"
import api, { ApiResponse } from "@/api/api";
import { toast } from "react-toastify";
import { create } from "zustand";

export type BusStopType = {
  name: string;
  code: string;
  status: string;
  location: {
    lat: number;
    lng: number;
  };
  id: string;
};

interface IBusStopsStore {
  busStops: BusStopType[];
  editingBusStop?: BusStopType;
  loadingBusStops: boolean;
  creatingBusStop: boolean;
  loadBusStops: () => Promise<void>;
  createBusStop: (
    busStopData: Pick<BusStopType, "name" | "code" | "location" | "status">
  ) => Promise<boolean>;
}

const useBusStopsStore = create<IBusStopsStore>()((set) => ({
  busStops: [],
  editingBusStop: undefined,
  loadingBusStops: true,
  creatingBusStop: false,
  loadBusStops: async () => {
    try {
      const response: ApiResponse<BusStopType[]> = await api.get("/bus-stops");

      if (response.success) {
        set({ busStops: response.data });
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error("Unable to fetch bus stops!");
    } finally {
      set({ loadingBusStops: false });
    }
  },
  createBusStop: async (busStopData) => {
    let success = true;
    set({ creatingBusStop: true });

    try {
      const response: ApiResponse<BusStopType[]> = await api.post(
        "/bus-stops",
        busStopData
      );

      if (response.success) {
        toast.success("Bus Stop Created Successfully!");
        set((state) => ({ busStops: [response.data[0], ...state.busStops] }));
      } else {
        throw new Error();
      }
    } catch (err) {
      success = false;
      toast.error("Unable to create new bus stop!");
    } finally {
      set({ creatingBusStop: false });
    }

    return success;
  }
}));

export default useBusStopsStore;
