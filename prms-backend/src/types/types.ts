export type RouteType = {
  name: string;
  start_bus_stop: string;
  end_bus_stop: string;
  expected_path: {
    lat: string;
    lng: string;
  }[];
  distance: number;
};

export type TripType = {
  route: string;
  actual_departure_time: string;
  actual_arrival_time: string;
  scheduled_departure_time: string;
  scheduled_arrival_time: string;
  actual_path: {
    lat: string;
    lng: string;
  }[];
  bus: string;
};

export type BusStopType = {
  name: string;
  location: {
    lat: string;
    lng: string;
  };
};

export type BusType = {
  bus_reg_no: string;
  location: {
    lat: string;
    lng: string;
  };
};
