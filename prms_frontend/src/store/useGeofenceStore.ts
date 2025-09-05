import api, { ApiResponse } from "@/api/api";
import { LAT_LNG_TYPE } from "@/types";
import { toast } from "react-toastify";
import { create } from "zustand";

export type GeofenceType = {
  name: string;
  status: string;
  type: string;
  bound: {
    northEast: LAT_LNG_TYPE;
    southWest: LAT_LNG_TYPE;
  };
  id: string;
};

interface IGeoFencesStore {
  geofences: GeofenceType[];
  loadingGeofences: boolean;
  creatingGeofence: boolean;
  editingGeofence?: GeofenceType;
  // selectedGeofence:

  loadGeofences: () => Promise<void>;
  createGeofence: (
    geofenceData: Pick<GeofenceType, "name" | "bound" | "status" | "type"> & {
      geofenced_id: string;
    },
    successCb: () => void
  ) => Promise<boolean>;
}

const useGeofenceStore = create<IGeoFencesStore>()((set) => ({
  geofences: [],
  loadingGeofences: true,
  creatingGeofence: false,
  editingGeofence: undefined,

  loadGeofences: async () => {
    try {
      const response: ApiResponse<GeofenceType[]> =
        await api.get("/geo-fences");

      console.log("routes", response);
      if (response.success) {
        set({ geofences: response.data });
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error("Unable to fetch routes!");
    } finally {
      // setLoadingGeofences(false);
      set({ loadingGeofences: false });
    }
  },
  createGeofence: async (geofenceData, successCb) => {
    let success = true;
    set({ creatingGeofence: true });

    try {
      const response: ApiResponse<GeofenceType[]> = await api.post(
        "/geo-fences",
        geofenceData
      );

      console.log("geofenceData", response);
      if (response.success) {
        set((state) => ({ geofences: [response.data[0], ...state.geofences] }));
        toast.success("Geofence Created Successfully!");
        successCb();
      } else {
        throw new Error();
      }
    } catch {
      success = false;
    } finally {
      set({ creatingGeofence: false });
    }

    return success;
  }
}));

export default useGeofenceStore;
