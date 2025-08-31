import { type PostgrestError } from "@supabase/supabase-js";
import { supabase } from "../config/db";
import { BusType } from "../types/types";

const createBusNode = async (busData: any) => {
  const { data, error } = await supabase
    .from("bus_nodes")
    .insert(busData)
    .select();

  return { data, error };
};

const editBusNode = async (
  id: string,
  busData: Partial<BusType>,
  propsToReturn?: string
) => {
  const { data, error } = await supabase
    .from("bus_nodes")
    .update(busData)
    .eq("id", id)
    .select(propsToReturn);

  return { data, error } as {
    data: Partial<BusType>[] | null;
    error: PostgrestError | null;
  };
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
  editBusNode,
  getBusNodeById
};
