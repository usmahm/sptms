import { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "../config/db";
import { Database, Tables } from "../types/database.types";
import { TripType } from "../types/types";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

type TripDType = Tables<"trips">;

// type SpaceSeperated<K extends string> = K | `${K} ${SpaceSeperated<K>}`;

// type FieldPattern = SpaceSeperated<keyof TripDType>

// type FieldPattern = `${keyof TripDType}` | `${keyof TripDType} ${keyof TripDType}`
// [FIX]!
const createTrip = async (tripData: any) => {
  const { data, error } = await supabase
    .from("trips")
    .insert(tripData)
    .select(
      `*,
      bus(
        code
      ),
      route!inner (
        id,
        name,
        code,
        distance,
        start_bus_stop:bus_stops!start_bus_stop(
          name, code, location
        ),
        end_bus_stop:bus_stops!end_bus_stop(
          name, code, location
        )
      )`
    );

  return { data, error };
};

const editTrip = async (id: string, tripData: Partial<TripType>) => {
  const { data, error } = await supabase
    .from("trips")
    .update(tripData)
    .eq("id", id)
    .select(
      `*,
      bus(
        code
      ),
      route!inner (
        id,
        name,
        code,
        distance,
        start_bus_stop:bus_stops!start_bus_stop(
          name, code, location
        ),
        end_bus_stop:bus_stops!end_bus_stop(
          name, code, location
        )
      )`
    );

  return { data, error };
};

const getAllTrips = async (filter: {
  startBusStop?: string;
  endBusStop?: string;
  isFuture?: boolean;
  onGoing?: boolean;
}) => {
  let query = supabase.from("trips").select(
    `*,
    bus(
      code
    ),
    route!inner (
      id,
      name,
      code,
      distance,
      start_bus_stop:bus_stops!start_bus_stop(
        name, code, location
      ),
      end_bus_stop:bus_stops!end_bus_stop(
        name, code, location
      )
    )`
  );

  if (filter.startBusStop) {
    query = query.eq(`route.start_bus_stop`, filter.startBusStop);
  }
  if (filter.endBusStop) {
    query = query.eq(`route.end_bus_stop`, filter.endBusStop);
  }
  if (filter.isFuture) {
    query = query.is("actual_departure_time", null);
  }
  if (filter.onGoing) {
    const currentDateTime = dayjs.utc().format();

    query = query
      .is("actual_arrival_time", null)
      .lte("actual_departure_time", currentDateTime);
  }

  const { data, error } = await query;

  return { data, error };
};

const getTripById = async (id: string, fields?: string) => {
  const { data, error } = await supabase
    .from("trips")
    .select(fields)
    .eq("id", id);

  return { data, error };
};

// [FIX]!: Implement properly
const getOnGoingTripByBusId = async (bus_id: string, fields?: string) => {
  const { data, error } = await supabase
    .from("trips")
    .select(fields)
    .eq("bus", bus_id);

  return { data, error } as {
    data: Partial<TripType>[] | null;
    error: PostgrestError | null;
  };
};

export default {
  createTrip,
  getAllTrips,
  getTripById,
  editTrip,
  getOnGoingTripByBusId
};
