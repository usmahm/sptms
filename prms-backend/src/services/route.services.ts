import { supabase } from "../config/db";
import { RouteType } from "../types/types";

const createRoute = async (routeData: RouteType) => {
  const { data, error } = await supabase
    .from("routes")
    .insert(routeData)
    .select();

  return { data, error };
};

const editRoute = async (id: string, routeData: Partial<RouteType>) => {
  const { data, error } = await supabase
    .from("routes")
    .update(routeData)
    .eq("id", id)
    .select();

  return { data, error };
};

const getAllRoutes = async () => {
  const { data, error } = await supabase.from("routes").select();

  return { data, error };
};

const getRouteById = async (id: string) => {
  const { data, error } = await supabase.from("routes").select().eq("id", id);

  return { data, error };
};

export default {
  createRoute,
  getAllRoutes,
  getRouteById,
  editRoute
};
