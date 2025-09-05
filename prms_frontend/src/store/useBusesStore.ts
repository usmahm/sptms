import api, { ApiResponse } from "@/api/api";
import { LAT_LNG_TYPE } from "@/types";
import { toast } from "react-toastify";
import { create } from "zustand";

export type BusType = {
  id: string;
  name: string;
  code: string;
  status: string;
  location?: LAT_LNG_TYPE;
  // capacity: number;
};

interface IBusesStore {
  buses: BusType[];
  editingBus?: BusType;
  selectedBus?: BusType;
  loadingBuses: boolean;
  creatingBus: boolean;
  loadBuses: () => Promise<void>;
  createBus: (
    busData: Pick<BusType, "name" | "code" | "status">,
    successCb: () => void
  ) => Promise<boolean>;
  selectBusHandler: (bus: BusType) => void;
}

const useBusesStore = create<IBusesStore>()((set) => ({
  loadingBuses: true,
  buses: [],
  editingBus: undefined,
  selectedBus: undefined,
  creatingBus: false,

  loadBuses: async () => {
    try {
      const response: ApiResponse<BusType[]> = await api.get("/bus-nodes");

      console.log("fleet", response);
      if (response.success) {
        // setFleet(response.data);
        set({ buses: response.data });
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error("Unable to load buses!");
    } finally {
      set({ loadingBuses: false });
    }
  },
  createBus: async (busData, successCb) => {
    let success = true;

    try {
      set({ creatingBus: true });

      const response: ApiResponse<BusType[]> = await api.post(
        "/bus-nodes",
        busData
      );
      if (response.success) {
        toast.success("Bus Created Successfully!");
        // onCreateBus(response.data[0]);
        set((state) => ({ buses: [response.data[0], ...state.buses] }));
        successCb();
      } else {
        throw new Error();
      }
    } catch {
      toast.error("Unable to create new bus!");
      success = false;
    } finally {
      set({ creatingBus: false });
    }

    return success;
  },
  selectBusHandler: (bus: BusType) => {
    set({ selectedBus: bus });
  }
}));

export default useBusesStore;
