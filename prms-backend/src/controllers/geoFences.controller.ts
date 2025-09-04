import { NextFunction, Request, Response } from "express";
import geoFencesServices from "../services/geoFences.services";
import responseService from "../utils/responseService";
import routeServices from "../services/route.services";
import busStopsServices from "../services/busStops.services";

export const createGeofence = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bound, name, geofenced_id, status, type } = req.body;

    const geofenceData = {
      bound,
      name,
      status,
      type
    };

    const { data, error } =
      await geoFencesServices.createGeofence(geofenceData);

    if (error) {
      return responseService.internalServerError(
        res,
        "Unexpected Error happened"
      );
    }

    if (data) {
      if (type === "ROUTE_PROTECTION") {
        const { data: res, error: err } = await routeServices.editRoute(
          geofenced_id,
          {
            geo_fence: data[0].id
          }
        );
      } else {
        const { data: res, error: err } = await busStopsServices.editBusStop(
          geofenced_id,
          {
            geo_fence: data[0].id
          }
        );
      }
    }

    responseService.created(res, "Geofence Created Successfully!", data);
  } catch (err) {
    next(err);
  }
};

export const editGeofence = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const geofence_id = req.params.geofence_id;

    // [FIX]! Implement validation later
    const geofenceData: any = req.body;

    const { data, error } = await geoFencesServices.editGeofence(
      geofence_id,
      geofenceData
    );
    if (error) {
      return responseService.internalServerError(
        res,
        "Unexpected Error happened"
      );
    }

    responseService.created(res, "Geofence Edited Successfully!", data);
  } catch (err) {
    next(err);
  }
};

export const getGeofences = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { data, error } = await geoFencesServices.getAllGeofences();

    if (error) {
      return responseService.internalServerError(
        res,
        "Unexpected Error happened"
      );
    }

    responseService.success(res, "Geofences Fetched Successfully!", data);
  } catch (err) {
    next(err);
  }
};

export const getGeofenceById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const geofence_id = req.params.geofence_id;

    const { data, error } =
      await geoFencesServices.getGeofenceById(geofence_id);

    if (!data?.length) {
      return responseService.notFoundError(res, "Geofence doesn't exist");
    }

    if (error) {
      return responseService.internalServerError(
        res,
        "Unexpected Error happened"
      );
    }

    responseService.success(res, "Geofence Fetched Successfully!", data);
  } catch (err) {
    next(err);
  }
};
