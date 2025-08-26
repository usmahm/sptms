import { NextFunction, Request, Response } from "express";
import tripsServices from "../services/trips.services";
import responseService from "../utils/responseService";
// import { BusStopType } from "../types/busStops.types";

export const createTrip = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      route,
      actual_path,
      scheduled_departure_time,
      scheduled_arrival_time,
      bus
    } = req.body;

    const tripData = {
      route,
      actual_path,
      scheduled_departure_time,
      scheduled_arrival_time,
      bus
    };

    const { data, error } = await tripsServices.createTrip(tripData);
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
