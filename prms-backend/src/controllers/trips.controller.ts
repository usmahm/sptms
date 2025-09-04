import { NextFunction, Request, response, Response } from "express";
import tripsServices from "../services/trips.services";
import responseService from "../utils/responseService";
import { randomUUID } from "crypto";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import googleMapsClient from "../config/googleMaps";
import { LAT_LNG_TYPE } from "../types/types";
import config from "../config/config";
import { TransitMode, TravelMode } from "@googlemaps/google-maps-services-js";
// import { BusStopType } from "../types/busStops.types";

dayjs.extend(timezone);

export const createTrip = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      route,
      scheduled_departure_time,
      bus
      // actual_path,
      // scheduled_arrival_time,
    } = req.body;

    const tripData = {
      route,
      scheduled_departure_time,
      bus,
      actual_path: []
      // scheduled_arrival_time,
    };

    const { data, error } = await tripsServices.createTrip(tripData);

    console.log("HEYYY 1212", data, error);

    if (error) {
      return responseService.internalServerError(
        res,
        "Unexpected Error happened"
      );
    }

    responseService.created(res, "Trip Created Successfully!", data);
  } catch (err) {
    next(err);
  }
};

export const editTrip = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const trip_id = req.params.trip_id;

    // [FIX]! Implement validation later
    const tripData: any = req.body;

    const { data, error } = await tripsServices.editTrip(trip_id, tripData);
    if (error) {
      return responseService.internalServerError(
        res,
        "Unexpected Error happened"
      );
    }

    responseService.created(res, "Trip Edited Successfully!", data);
  } catch (err) {
    next(err);
  }
};

interface GetTripsQuery {
  startBusStop?: string;
  timezone?: string;
  endBusStop?: string;
  isFuture?: boolean;
  onGoing?: boolean;
  getEstimatedArrival?: boolean;
}

const toTz = (val: string | null, timezone: string) =>
  val ? dayjs(val).tz(timezone).format() : val;

export const getTrips = async (
  req: Request<{}, {}, {}, GetTripsQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const startBusStop = req.query.startBusStop;
    const endBusStop = req.query.endBusStop;
    const isFuture = req.query.isFuture;
    const onGoing = req.query.onGoing;
    const timezone = req.query.timezone;
    const getEstimatedArrival = req.query.getEstimatedArrival;

    const { data, error } = await tripsServices.getAllTrips({
      startBusStop,
      endBusStop,
      isFuture,
      onGoing
    });

    if (error) {
      return responseService.internalServerError(
        res,
        "Unexpected Error happened"
      );
    }

    let parsedResponse = data;

    console.log("HEYYY 111", parsedResponse);
    if (timezone && data) {
      // for esp nodes, fix timezone hardcoded
      parsedResponse = data?.map((tr) => ({
        ...tr,
        scheduled_departure_time: toTz(tr.scheduled_departure_time, timezone),
        scheduled_arrival_time: toTz(tr.scheduled_arrival_time, timezone)
        // estimated_arrival_time:
        // actual_arrival_time: toTz(tr.actual_arrival_time, timezone)
      }));
    }

    // [FIX]! BAADDDD refactor later:
    if (getEstimatedArrival && parsedResponse) {
      const promises = parsedResponse.map((tr) =>
        googleMapsClient.directions({
          params: {
            // @ts-ignore
            origin: tr.actual_path[tr.actual_path.length - 1],
            destination: tr.route.end_bus_stop.location as LAT_LNG_TYPE,
            key: config.GOOGLE_MAPS_API_KEY,
            transit_mode: [TransitMode.bus]
          }
        })
      );

      console.log("HEEYEYE", promises.length);
      const res = await Promise.all(promises);
      parsedResponse = parsedResponse.map((r, i) => {
        const duration = res[i].data.routes[0].legs[0].duration.value;

        console.log("HEYYY 32323", duration);

        let estimated_arrival_time = dayjs().add(duration, "second").format();
        if (timezone) {
          estimated_arrival_time = dayjs(estimated_arrival_time)
            .tz(timezone)
            .format();
        }

        return {
          ...r,
          estimated_arrival_time
        };
      });

      // console.log("HEYYYY 000", res);
    }

    responseService.success(res, "Trips Fetched Successfully!", parsedResponse);
  } catch (err) {
    next(err);
  }
};

export const getTripById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const trip_id = req.params.trip_id;

    const { data, error } = await tripsServices.getTripById(trip_id);

    if (!data?.length) {
      return responseService.notFoundError(res, "Trip doesn't exist");
    }

    if (error) {
      return responseService.internalServerError(
        res,
        "Unexpected Error happened"
      );
    }

    responseService.success(res, "Trip Fetched Successfully!", data);
  } catch (err) {
    next(err);
  }
};

export let tripsEventClients: {
  id: string;
  trip_id: string;
  response: Response;
}[] = [];

export const tripsPathEventHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const trip_id = req.params.trip_id;

    const { data, error } = await tripsServices.getTripById(
      trip_id,
      "actual_path"
    );

    if (!data?.length) {
      return responseService.notFoundError(res, "Trip doesn't exist");
    }

    if (error) {
      return responseService.internalServerError(
        res,
        "Unexpected Error happened"
      );
    }

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache"
    });

    // [FIX]!!!
    // @ts-ignore
    const resData = `data: ${JSON.stringify(data[0].actual_path)}\n\n`;
    res.write(resData);

    const newEventClient = {
      id: randomUUID(),
      response: res,
      trip_id
    };

    tripsEventClients.push(newEventClient);
    console.log(`SSE: ${newEventClient.id} Connection opened`);

    req.on("close", () => {
      console.log(`SSE: ${newEventClient.id} Connection closed`);
      tripsEventClients = tripsEventClients.filter(
        (client) => client.id !== newEventClient.id
      );
    });
  } catch (err) {
    next(err);
  }
};

// export const path
