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
