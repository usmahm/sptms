import { supabase } from "../config/db";
import { LAT_LNG_TYPE } from "../types/types";

export type BusOfflineNotification = {
  type: "BUS_OFFLINE";
  bus_id: string;
  payload: {
    last_location: LAT_LNG_TYPE;
  };
};
export type GeofenceViolationNotification = {
  type: "GEOFENCE_VIOLATION";
  trip_id: string;
  payload: {
    route_path: LAT_LNG_TYPE[];
  };
};

type NotificationType = BusOfflineNotification | GeofenceViolationNotification;

const createNotification = async (notificationData: NotificationType) => {
  const { data, error } = await supabase
    .from("notifications")
    .insert(notificationData).select(`
      *,
      trip_id(
        bus(
          code
        ),
        route!inner (
          id,
          name,
          start_bus_stop:bus_stops!start_bus_stop(
            name, code
          ),
          end_bus_stop:bus_stops!end_bus_stop(
            name, code
          )
        )
      )
      `);

  return { data, error };
};

const getAllNotification = async (filter: {
  unread?: boolean;
  after?: string;
}) => {
  let query = supabase.from("notifications").select(
    `
      *,
      trip:trip_id(
        bus(
          code
        ),
        route!inner (
          id,
          name,
          start_bus_stop:bus_stops!start_bus_stop(
            name, code
          ),
          end_bus_stop:bus_stops!end_bus_stop(
            name, code
          )
        )
      )
      `
  );

  if (filter.unread) {
    query = query.eq("read", false);
  }
  if (filter.after) {
    query = query.gte("created_at", filter.after);
  }

  const { data, error } = await query;

  return { data, error };
};

const getNotificationByTripId = async (tripId: string) => {
  let query = supabase
    .from("notifications")
    .select()
    .eq("trip_id", tripId)
    .single();

  const { data, error } = await query;

  return { data, error };
};

const markNotificationRead = async () => {
  const { data, error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("read", false);

  return { data, error };
};

const getUnreadNotificationsCount = async () => {
  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("read", false);

  return { count, error };
};

export default {
  createNotification,
  getAllNotification,
  markNotificationRead,
  getUnreadNotificationsCount,
  getNotificationByTripId
};
