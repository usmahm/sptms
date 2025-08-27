import { supabase } from "../config/db";
import { GeofenceType } from "../types/types";

const createGeofence = async (geofenceData: GeofenceType) => {
  const { data, error } = await supabase
    .from("geo_fences")
    .insert(geofenceData)
    .select();

  return { data, error };
};

const editGeofence = async (
  id: string,
  geofenceData: Partial<GeofenceType>
) => {
  const { data, error } = await supabase
    .from("geo_fences")
    .update(geofenceData)
    .eq("id", id);

  return { data, error };
};

const getAllGeofences = async () => {
  const { data, error } = await supabase.from("geo_fences").select();

  return { data, error };
};

const getGeofenceById = async (id: string) => {
  const { data, error } = await supabase
    .from("geo_fences")
    .select()
    .eq("id", id);

  return { data, error };
};

export default {
  createGeofence,
  getAllGeofences,
  getGeofenceById,
  editGeofence
};
