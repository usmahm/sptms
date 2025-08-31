import { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "../config/db";
import { Database, Tables } from "../types/database.types";
import { TripType } from "../types/types";

type TripDType = Tables<"trips">;

// type SpaceSeperated<K extends string> = K | `${K} ${SpaceSeperated<K>}`;

// type FieldPattern = SpaceSeperated<keyof TripDType>

// type FieldPattern = `${keyof TripDType}` | `${keyof TripDType} ${keyof TripDType}`
// [FIX]!
const createTrip = async (tripData: any) => {
  const { data, error } = await supabase
    .from("trips")
    .insert(tripData)
    .select();

  return { data, error };
};

const editTrip = async (id: string, tripData: Partial<TripType>) => {
  const { data, error } = await supabase
    .from("trips")
    .update(tripData)
    .eq("id", id)
    .select();

  return { data, error };
};

const getAllTrips = async () => {
  const { data, error } = await supabase.from("trips").select();

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
