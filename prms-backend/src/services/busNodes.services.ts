import { supabase } from "../config/db";
import { BusType } from "../types/types";

const createBusNode = async (busData: any) => {
  const { data, error } = await supabase
    .from("bus_nodes")
    .insert(busData)
    .select();

  return { data, error };
};

const getAllBusNodes = async () => {
  const { data, error } = await supabase.from("bus_nodes").select();

  return { data, error };
};

const getBusNodeById = async (id: string) => {
  const { data, error } = await supabase
    .from("bus_nodes")
    .select()
    .eq("id", id);

  return { data, error };
};

export default {
  createBusNode,
  getAllBusNodes,
  getBusNodeById
};
