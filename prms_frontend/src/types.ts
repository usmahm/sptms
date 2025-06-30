export type LAT_LNG_TYPE = {
  lat: number;
  lng: number;
};

export type TRIP = {
  id: string;
  route_name: string;
  actual_arrival_time: string;
  actual_departure_time: string;
  actual_path: LAT_LNG_TYPE[];
  expected_path: LAT_LNG_TYPE[];
  bus_node_id: string;
  distance: number;
  start_bus_stop: string;
  end_bus_stop: string;
  scheduled_arrival_time: string;
  scheduled_departure_time: string;
}

export type DESIRED_TRIP_TYPE = {
  to?: LAT_LNG_TYPE;
  fro?: LAT_LNG_TYPE;
};

export type BUS_STOP_TYPE = {
  location: LAT_LNG_TYPE;
  name: string;
};