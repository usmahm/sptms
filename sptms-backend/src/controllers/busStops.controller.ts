import { NextFunction, Request, Response } from "express";
import busStopsService from "../services/busStops.services";
import responseService from "../utils/responseService";
import { BusStopType } from "../types/types";

export const createBusStop = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, location, code, status } = req.body;

    const busData: BusStopType = {
      name,
      location,
      code,
      status
    };

    const { data, error } = await busStopsService.createBusStop(busData);
    if (error) {
      return responseService.internalServerError(
        res,
        "Unexpected Error happened"
      );
    }

    responseService.created(res, "Bus Stop Created Successfully!", data);
  } catch (err) {
    next(err);
  }
};

export const getBusStops = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { data, error } = await busStopsService.getAllBusStops();

    if (error) {
      return responseService.internalServerError(
        res,
        "Unexpected Error happened"
      );
    }

    responseService.success(res, "Bus Stops Fetched Successfully!", data);
  } catch (err) {
    next(err);
  }
};

export const getBusStopById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stop_id = req.params.stop_id;

    const { data, error } = await busStopsService.getBusStopById(stop_id);

    if (!data?.length) {
      return responseService.notFoundError(res, "Bus Stop doesn't exist");
    }

    if (error) {
      return responseService.internalServerError(
        res,
        "Unexpected Error happened"
      );
    }

    responseService.success(res, "Bus Stop Fetched Successfully!", data);
  } catch (err) {
    next(err);
  }
};
