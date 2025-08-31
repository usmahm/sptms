import { NextFunction, Request, response, Response } from "express";
import tripsServices from "../services/trips.services";
import responseService from "../utils/responseService";
import { randomUUID } from "crypto";
// import { BusStopType } from "../types/busStops.types";

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

export const getTrip = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { data, error } = await tripsServices.getAllTrips();

    if (error) {
      return responseService.internalServerError(
        res,
        "Unexpected Error happened"
      );
    }

    responseService.success(res, "Trips Fetched Successfully!", data);
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
