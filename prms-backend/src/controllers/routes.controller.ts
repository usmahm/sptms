import { NextFunction, Request, Response } from "express";
import routeService from "../services/route.services";
import responseService from "../utils/responseService";
// import { BusStopType } from "../types/busStops.types";

export const createRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, start_bus_stop, end_bus_stop, expected_path, distance } =
      req.body;

    const routeData = {
      name,
      start_bus_stop,
      end_bus_stop,
      expected_path,
      distance
    };

    const { data, error } = await routeService.createRoute(routeData);
    if (error) {
      return responseService.internalServerError(
        res,
        "Unexpected Error happened"
      );
    }

    responseService.created(res, "Route Created Successfully!", data);
  } catch (err) {
    next(err);
  }
};

export const editRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const route_id = req.params.route_id;

    // [FIX]! Implement validation later
    const routeData: any = req.body;

    const { data, error } = await routeService.editRoute(route_id, routeData);
    if (error) {
      return responseService.internalServerError(
        res,
        "Unexpected Error happened"
      );
    }

    responseService.created(res, "Route Edited Successfully!", data);
  } catch (err) {
    next(err);
  }
};

export const getRoutes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { data, error } = await routeService.getAllRoutes();

    if (error) {
      return responseService.internalServerError(
        res,
        "Unexpected Error happened"
      );
    }

    responseService.success(res, "Routes Fetched Successfully!", data);
  } catch (err) {
    next(err);
  }
};

export const getRouteById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const route_id = req.params.route_id;

    const { data, error } = await routeService.getRouteById(route_id);

    if (!data?.length) {
      return responseService.notFoundError(res, "Route doesn't exist");
    }

    if (error) {
      return responseService.internalServerError(
        res,
        "Unexpected Error happened"
      );
    }

    responseService.success(res, "Route Fetched Successfully!", data);
  } catch (err) {
    next(err);
  }
};
