import { supabase } from "../config/db";
import { BusStopType } from "../types/types";

const createBusStop = async (busData: BusStopType) => {
  const { data, error } = await supabase
    .from("bus_stops")
    .insert(busData)
    .select();

  return { data, error };
};

const getAllBusStops = async () => {
  const { data, error } = await supabase.from("bus_stops").select();

  return { data, error };
};

const getBusStopById = async (id: string) => {
  const { data, error } = await supabase
    .from("bus_stops")
    .select()
    .eq("id", id);

  return { data, error };
};

const editBusStop = async (id: string, busData: Partial<BusStopType>) => {
  const { data, error } = await supabase
    .from("bus_stops")
    .update(busData)
    .eq("id", id)
    .select();

  return { data, error };
};

export default {
  createBusStop,
  getAllBusStops,
  getBusStopById,
  editBusStop
};
