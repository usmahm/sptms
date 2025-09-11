import { LAT_LNG_TYPE, RECTANGLE_BOUND } from "../types/types";

export const checkIfBoundContains = (
  rectangleBounds: RECTANGLE_BOUND,
  point: LAT_LNG_TYPE
) => {
  const southWest = rectangleBounds.southWest;
  const northEast = rectangleBounds.northEast;

  const lat = point.lat,
    lng = point.lng;

  // latitude must be between south and north
  if (lat < southWest.lat || lat > northEast.lat) return false;

  // handle longitude normally or across antimeridian
  if (southWest.lng <= northEast.lng) {
    return lng >= southWest.lng && lng <= northEast.lng;
  } else {
    return lng >= southWest.lng || lng <= northEast.lng;
  }
};

export const haversineDistance = (p1: LAT_LNG_TYPE, p2: LAT_LNG_TYPE) => {
  const R = 6371e3; // metres
  const φ1 = (p1.lat * Math.PI) / 180; // φ, λ in radians
  const φ2 = (p2.lat * Math.PI) / 180;
  const Δφ = ((p2.lat - p1.lat) * Math.PI) / 180;
  const Δλ = ((p2.lng - p1.lng) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c; // in metres
  return d;
};
