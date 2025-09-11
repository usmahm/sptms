import api, { ApiResponse } from "@/api/api";
import { LAT_LNG_TYPE } from "@/types";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { create } from "zustand";
import { RouteType } from "./useRoutesStore";

export type TripType = {
  id: string;
  // route: string;
  route: {
    code: string;
    id: string;
    name: string;
    distance: number;
    end_bus_stop: {
      code: string;
      name: string;
    };
    start_bus_stop: {
      code: string;
      name: string;
    };
  };
  actual_arrival_time?: string;
  actual_departure_time?: string;
  actual_path: LAT_LNG_TYPE[];
  bus: {
    code: string;
  };
  scheduled_arrival_time?: string;
  scheduled_departure_time?: string;
};

interface ITripsStore {
  loadingTrips: boolean;
  creatingTrip: boolean;
  lastDurationTimeUpdate: string | null;
  tripEvent?: EventSource;
  trips: TripType[];

  selectedTrip?: TripType;
  editingTrip?: TripType;
  selectedTripRoute?: RouteType;

  loadTrips: () => Promise<void>;
  startTripHandler: (id: string) => Promise<void>;
  selectTripHandler: (trip: TripType) => Promise<void>;
  subscribeToTripUpdate: (tripId: string) => Promise<void>;
  updateArrivalTime: (currentLocation: LAT_LNG_TYPE) => Promise<void>;
  removeActiveTripUpdateEvent: () => void;
  createTripHandler: (
    tripData: Pick<
      TripType,
      "scheduled_departure_time" | "scheduled_arrival_time"
    > & {
      bus: string;
      route: string;
    },
    successCb: () => void
  ) => Promise<boolean>;
}

const useTripsStore = create<ITripsStore>()((set, get) => ({
  loadingTrips: true,
  trips: [],
  editingTrip: undefined,
  lastDurationTimeUpdate: null,
  creatingTrip: false,

  loadTrips: async () => {
    try {
      const response: ApiResponse<TripType[]> = await api.get("/trips");

      console.log("trips", response);
      if (response.success) {
        // setTrips(response.data);
        set({ trips: response.data });
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error("Unable to fetch routes!");
    } finally {
      // setLoadingTrips(false);
      set({ loadingTrips: false });
    }
  },
  createTripHandler: async (tripData, successCb) => {
    let success = true;
    set({ creatingTrip: true });

    try {
      const response: ApiResponse<TripType[]> = await api.post(
        "/trips",
        tripData
      );

      // console.log("routeData", response);
      if (response.success) {
        toast.success("Trip Created Successfully!");
        // onCreateTrip(response.data[0]);
        set((state) => ({ trips: [response.data[0], ...state.trips] }));
        successCb();
      } else {
        throw new Error();
      }
    } catch {
      success = false;
      toast.error("Unable to create Trip!");
    } finally {
      // setSubmitting(false);
      set({ creatingTrip: false });
    }

    return success;
  },
  startTripHandler: async (tripId) => {
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

        set((state) => ({
          trips: state.trips.map((tr) => {
            if (tr.id === editedTrip.id) {
              return editedTrip;
            }

            return tr;
          })
        }));
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error("Unable to fetch routes!");
    } finally {
      // set({ loadingTrips: false });
    }
  },
  selectTripHandler: async (trip) => {
    set({ selectedTripRoute: undefined, selectedTrip: trip });

    try {
      const response: ApiResponse<RouteType> = await api.get(
        `/routes/${trip.route.id}`
      );

      if (response.success) {
        console.log("routes", response, trip);

        set({ selectedTripRoute: response.data });
      } else {
        throw new Error();
      }

      if (trip.actual_departure_time && !trip.actual_arrival_time) {
        get().subscribeToTripUpdate(trip.id);
      }
    } catch {
      toast.error("Unable to fetch selected trip route");
    }
  },
  subscribeToTripUpdate: async (tripId: string) => {
    try {
      get().removeActiveTripUpdateEvent();

      const events = new EventSource(
        `${api.getUri()}/trips/path/events/${tripId}`
      );

      let firstLoad = true;
      events.onmessage = (event) => {
        console.log("HEYYY event data", event.data);
        const parsedData: LAT_LNG_TYPE[] = JSON.parse(event.data);

        if (get().selectedTrip) {
          set((state) => {
            if (state.selectedTrip) {
              return {
                selectedTrip: {
                  ...state.selectedTrip,
                  actual_path: firstLoad
                    ? parsedData
                    : [...state.selectedTrip.actual_path, ...parsedData]
                }
              };
            }

            return {};
          });

          firstLoad = false;

          get().updateArrivalTime(parsedData[parsedData.length - 1]);
        }
      };

      set({ tripEvent: events });
    } catch {
      toast.error("Unable to track trip, try again!");
    }
  },
  updateArrivalTime: async (currentLocation) => {
    const isMoreThanOneMin =
      Math.abs(dayjs().diff(dayjs(get().lastDurationTimeUpdate), "minute")) >=
      2;

    let selectedTripRoute = get().selectedTripRoute;
    if (isMoreThanOneMin && selectedTripRoute) {
      // fetch and update estimated arrival time
      const directionService = new google.maps.DirectionsService();

      const directionResult = await directionService.route({
        origin: currentLocation,
        destination: selectedTripRoute.end_bus_stop.location,
        travelMode: google.maps.TravelMode.DRIVING
      });

      console.log("HEYYY 1111 UPDATING ARRIVAL TIME", directionResult);

      set((state) => {
        selectedTripRoute = state.selectedTripRoute;
        if (selectedTripRoute) {
          if (
            directionResult?.routes &&
            directionResult.routes[0].legs &&
            directionResult.routes[0].legs[0].distance &&
            directionResult.routes[0].legs[0].duration
          ) {
            const newDistance =
              directionResult.routes[0].legs[0].distance.value;
            const newDuration =
              directionResult.routes[0].legs[0].duration.value;

            return {
              ...selectedTripRoute,
              duration: newDuration || selectedTripRoute.duration,
              distance: newDistance || selectedTripRoute.distance
            };
          }
        }

        return {};
      });
    }
  },
  removeActiveTripUpdateEvent: () => {
    const tripEvent = get().tripEvent;
    if (tripEvent) {
      tripEvent.close();
      set({ tripEvent: undefined });
    }
  }
}));

export default useTripsStore;
