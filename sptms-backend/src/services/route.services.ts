import { supabase } from "../config/db";
import { RouteType } from "../types/types";

const createRoute = async (routeData: RouteType) => {
  const { data, error } = await supabase
    .from("routes")
    .insert(routeData)
    .select(
      `
      *,
      geo_fence(id, bound),
      start_bus_stop:bus_stops!start_bus_stop(
        name, code, location
      ),
      end_bus_stop:bus_stops!end_bus_stop(
        name, code, location
      )
    `
    );

  return { data, error };
};

const editRoute = async (id: string, routeData: Partial<RouteType>) => {
  const { data, error } = await supabase
    .from("routes")
    .update(routeData)
    .eq("id", id)
    .select(
      `
      *,
      geo_fence(id, bound),
      start_bus_stop:bus_stops!start_bus_stop(
        name, code, location
      ),
      end_bus_stop:bus_stops!end_bus_stop(
        name, code, location
      )
    `
    );

  return { data, error };
};

const getAllRoutes = async () => {
  const { data, error } = await supabase.from("routes").select(
    `
      *,
      geo_fence(id, bound),
      start_bus_stop:bus_stops!start_bus_stop(
        name, code, location
      ),
      end_bus_stop:bus_stops!end_bus_stop(
        name, code, location
      )
    `
  );

  return { data, error };
};

const getRouteById = async (id: string) => {
  const { data, error } = await supabase
    .from("routes")
    .select(
      `
      *,
      geo_fence(id, bound),
      start_bus_stop:bus_stops!start_bus_stop(
        name, code, location
      ),
      end_bus_stop:bus_stops!end_bus_stop(
        name, code, location
      )
    `
    )
    .eq("id", id)
    .single();

  return { data, error };
};

export default {
  createRoute,
  getAllRoutes,
  getRouteById,
  editRoute
};
