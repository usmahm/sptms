import { RouteType } from "@/components/Forms/CreateRoute";
import { LAT_LNG_TYPE } from "@/types";

export type RECTANGLE_BOUND = {
  northEast: LAT_LNG_TYPE;
  southWest: LAT_LNG_TYPE;
};

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

export const mTokm = (num: number) => {
  return (num / 1000).toFixed(1);
};

export const secToMin = (num: number) => {
  return (num / 60).toFixed();
};

export const toLatLngBounds = (
  geoFenceBound: RouteType["geo_fence"]["bound"]
): google.maps.LatLngBounds => {
  const sw = new google.maps.LatLng(
    geoFenceBound.southWest.lat,
    geoFenceBound.southWest.lng
  );
  const ne = new google.maps.LatLng(
    geoFenceBound.northEast.lat,
    geoFenceBound.northEast.lng
  );

  return new google.maps.LatLngBounds(sw, ne);
};
