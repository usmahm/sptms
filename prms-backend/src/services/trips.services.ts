import { supabase } from "../config/db";
import { TripType } from "../types/types";

// [FIX]!
const createTrip = async (tripData: any) => {
  const { data, error } = await supabase
    .from("trips")
    .insert(tripData)
    .select();

  return { data, error };
};

const editTrip = async (id: string, tripData: TripType) => {
  const { data, error } = await supabase
    .from("trips")
    .update(tripData)
    // .select()
    .eq("id", id);

  return { data, error };
};

const getAllTrips = async () => {
  const { data, error } = await supabase.from("trips").select();

  return { data, error };
};

const getTripById = async (id: string) => {
  const { data, error } = await supabase.from("trips").select().eq("id", id);

  return { data, error };
};

export default {
  createTrip,
  getAllTrips,
  getTripById,
  editTrip
};
