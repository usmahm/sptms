import api, { ApiResponse } from "@/api/api";
import { LAT_LNG_TYPE } from "@/types";
import { toast } from "react-toastify";
import { create } from "zustand";
import { GeofenceType } from "./useGeofenceStore";

export type RouteType = {
  name: string;
  code: string;
  start_bus_stop: {
    code: string;
    name: string;
    location: LAT_LNG_TYPE;
  };
  end_bus_stop: {
    code: string;
    name: string;
    location: LAT_LNG_TYPE;
  };
  expected_path: {
    lat: number;
    lng: number;
  }[];
  geo_fence: Pick<GeofenceType, "id" | "bound">;
  duration: number;
  distance: number;
  id: string;
  status: string;
};

interface IRoutesStore {
  routes: RouteType[];
  editingRoute?: RouteType;
  loadingRoutes: boolean;
  creatingRoute: boolean;

  loadRoutes: () => Promise<void>;
  createRoute: (
    routeData: Pick<
      RouteType,
      "code" | "distance" | "duration" | "expected_path" | "name" | "status"
    > & {
      end_bus_stop: string;
      start_bus_stop: string;
    },
    successCb: () => void
  ) => Promise<boolean>;
}

const useRoutesStore = create<IRoutesStore>()((set) => ({
  routes: [],
  editingRoute: undefined,
  loadingRoutes: true,
  creatingRoute: false,

  loadRoutes: async () => {
    try {
      const response: ApiResponse<RouteType[]> = await api.get("/routes");
      if (response.success) {
        console.log("routes", response);

        set({ routes: response.data });
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error("Unable to fetch routes!");
    } finally {
      set({ loadingRoutes: false });
    }
  },
  createRoute: async (routeData, successCb) => {
    let success = true;
    set({ creatingRoute: true });

    try {
      const response: ApiResponse<RouteType[]> = await api.post(
        "/routes",
        routeData
      );

      if (response.success) {
        set((state) => ({ routes: [response.data[0], ...state.routes] }));
        toast.success("Route Created Successfully!");
        successCb();
      } else {
        toast.error("Unable to create Route!");
        throw new Error();
      }
    } catch {
      success = false;
    } finally {
      set({ creatingRoute: false });
    }

    return success;
  }
}));

export default useRoutesStore;
