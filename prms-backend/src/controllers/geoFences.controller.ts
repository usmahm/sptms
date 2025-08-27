import { NextFunction, Request, Response } from "express";
import geoFencesServices from "../services/geoFences.services";
import responseService from "../utils/responseService";
import routeServices from "../services/route.services";

export const createGeofence = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bound, name, route, status, type } = req.body;

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
      console.log("HEYYY xdfbdbv");
      const { data: res, error: err } = await routeServices.editRoute(route, {
        geo_fence: data[0].id
      });
      console.log("HEYYY sdsd", res, err);
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
