import api, { ApiResponse } from "@/api/api";
import { socket } from "@/api/socket";
import { LAT_LNG_TYPE } from "@/types";
import { toast } from "react-toastify";
import { create } from "zustand";
import { BusType } from "./useBusesStore";
import { RouteType } from "./useRoutesStore";

export type BusOfflineNotification = {
  type: "BUS_OFFLINE";
  bus_id: string;
  read: boolean;
  payload: {
    last_location: LAT_LNG_TYPE;
  };
  created_at: string;
  id: string;
};
export type GeofenceViolationNotification = {
  type: "GEOFENCE_VIOLATION";
  trip_id: string;
  trip: {
    bus: Pick<BusType, "code">;
    route: Pick<RouteType, "id" | "end_bus_stop" | "start_bus_stop" | "name">;
  };
  read: boolean;
  payload: {
    route_path: LAT_LNG_TYPE[];
  };
  created_at: string;
  id: string;
};

type NotificationType = BusOfflineNotification | GeofenceViolationNotification;

interface INotificationsStore {
  notifications: NotificationType[];
  loadingNotifications: boolean;
  unreadCount: number;
  loadNotifications: (latest?: boolean) => Promise<void>;
  markNotificationsRead: () => Promise<void>;
  addNotification: (notification: NotificationType) => void;
  subscribeToNotifications: () => void;
  unsubscribeFromNotifications: () => void;
  fetchUnreadNotificationsCount: () => void;
}

const useNotificationsStore = create<INotificationsStore>()((set, get) => ({
  notifications: [],
  loadingNotifications: true,
  unreadCount: 0,

  loadNotifications: async (latest) => {
    set({ loadingNotifications: true });

    try {
      let endpoint = "/notifications";
      const currentNotifications = get().notifications;

      if (latest && currentNotifications.length) {
        endpoint = `/notifications?after=${currentNotifications[0].created_at}`;
      }

      const response: ApiResponse<NotificationType[]> = await api.get(endpoint);

      console.log("HEYYYY pqpqpqp", response);
      if (response.success) {
        if (!latest) {
          set({ notifications: response.data });
        } else {
          set((state) => ({
            notifications: [...response.data, ...state.notifications]
          }));
        }

        await get().markNotificationsRead();
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error("Unable to fetch notifications!");
    } finally {
      set({ loadingNotifications: false });
    }
  },
  markNotificationsRead: async () => {
    try {
      const response: ApiResponse<undefined> = await api.patch(
        "/notifications/read"
      );

      set({ unreadCount: 0 });
    } catch {
      toast.error("Problem marking notifications as read!");
    }
  },
  addNotification: (notification) => {
    set((state) => ({ notifications: [notification, ...state.notifications] }));
  },
  fetchUnreadNotificationsCount: async () => {
    try {
      const response: ApiResponse<{ count: number }> = await api.get(
        "/notifications/count"
      );

      if (response.success) {
        set({ unreadCount: response.data.count });
      }
    } catch {
      toast.error("Problem marking notifications as read!");
    }
  },
  subscribeToNotifications: () => {
    socket.on("connect", () => {
      console.log("HEYYY connected");
    });

    socket.on("notification", (data) => {
      console.log("HEYYY NERWEEE", data);
      set((state) => ({ unreadCount: state.unreadCount + data.length }));
    });
  },
  unsubscribeFromNotifications: () => {
    socket.disconnect();
  }
}));

export default useNotificationsStore;
