export type LAT_LNG_TYPE = {
  lat: number;
  lng: number;
};

export type RouteType = {
  name: string;
  code: string;
  start_bus_stop: string;
  end_bus_stop: string;
  geo_fence?: string;
  expected_path: LAT_LNG_TYPE[];
  duration: number;
  distance: number;
  status: string;
};

export type TripType = {
  route: string;
  actual_departure_time: string;
  actual_arrival_time: string;
  scheduled_departure_time: string;
  scheduled_arrival_time: string;
  actual_path: LAT_LNG_TYPE[];
  bus: string;
};

export type BusStopType = {
  name: string;
  code: string;
  status: string;
  location: LAT_LNG_TYPE;
};

export type BusType = {
  name: string;
  code: string;
  location?: LAT_LNG_TYPE;
  status?: string;
};

export type GeofenceType = {
  name: string;
  status: string;
  type: string;
  bound: {
    southWest: LAT_LNG_TYPE;
    northEast: LAT_LNG_TYPE;
  };
};
