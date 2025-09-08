import { NextFunction, Request, Response } from "express";
import busNodesService from "../services/busNodes.services";
import responseService from "../utils/responseService";
import {
  BusType,
  LAT_LNG_TYPE,
  TripType,
  RECTANGLE_BOUND
} from "../types/types";
import tripsServices from "../services/trips.services";
import { Tables } from "../types/database.types";
import { tripsEventClients } from "./trips.controller";
import { checkIfBoundContains } from "../utils/utils";
import notificationsServices, {
  GeofenceViolationNotification
} from "../services/notifications.services";
import { io } from "../app";

export const createBusNode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, status, code } = req.body;

    const busData: BusType = {
      name,
      status,
      code
    };

    const { data, error } = await busNodesService.createBusNode(busData);
    if (error) {
      return responseService.internalServerError(
        res,
        "Unexpected Error happened"
      );
    }

    responseService.created(res, "Bus Node Created Successfully!", data);
  } catch (err) {
    next(err);
  }
};

export const getBusNodes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { data, error } = await busNodesService.getAllBusNodes();

    if (error) {
      return responseService.internalServerError(
        res,
        "Unexpected Error happened"
      );
    }

    responseService.success(res, "Bus Nodes Fetched Successfully!", data);
  } catch (err) {
    next(err);
  }
};

export const editBusNode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const node_id = req.params.node_id;

    // [FIX]! Implement validation later
    const routeData: any = req.body;

    const { data, error } = await busNodesService.editBusNode(
      node_id,
      routeData
    );

    if (error) {
      return responseService.internalServerError(
        res,
        "Unexpected Error happened"
      );
    }

    responseService.created(res, "Bus Node Edited Successfully!", data);
  } catch (err) {
    next(err);
  }
};

// const checkIsWithinGeofence = () => {

// }

/**
 * Updates bus location
 * Updates ongoing trips bus is on // not well implemented yet
 * alerts all clients subscribed to SSE on trips
 */
export const updateLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const node_id = req.params.node_id;

    const { location } = req.body;
    const update = {
      location
    };

    // Updates bus location
    const propertiesToReturn = Object.keys(update).join(" ");
    let { data, error } = await busNodesService.editBusNode(
      node_id,
      update,
      propertiesToReturn
    );

    if (error) {
      return responseService.internalServerError(
        res,
        "Unexpected Error happened"
      );
    }

    // Updates ongoing trip bus is on
    // get trip the bus is on and update its actual path
    // Send notification if bus leaves geofence
    const { data: tripData, error: tripError } =
      await tripsServices.getOnGoingTripByBusId(
        node_id,
        `
          id,
          actual_path,
          route(
            geo_fence(bound)
          )
        `
      );

    if (tripError) {
      return responseService.internalServerError(
        res,
        "Unexpected Error happened"
      );
    }

    // [FIX]! type
    if (tripData) {
      // @ts-ignore
      let trData: Pick<TripType, "actual_path" | "id"> & {
        route: {
          geo_fence: {
            bound: RECTANGLE_BOUND;
          };
        };
      } = tripData;

      await tripsServices.editTrip(trData.id, {
        actual_path: [...trData.actual_path, location]
      });

      const tripEvent = tripsEventClients.find(
        (tr) => tr.trip_id === trData.id
      );

      if (tripEvent) {
        const resData = `data: ${JSON.stringify([location])}\n\n`;
        tripEvent.response.write(resData);
      }

      const isWithinGeoFence = checkIfBoundContains(
        trData.route.geo_fence.bound,
        location
      );

      if (!isWithinGeoFence) {
        const { data: tripNot, error: tripNotError } =
          await notificationsServices.getNotificationByTripId(trData.id);

        if (!tripNot) {
          const notificationData: GeofenceViolationNotification = {
            type: "GEOFENCE_VIOLATION",
            trip_id: trData.id,
            payload: {
              route_path: [...trData.actual_path, location]
            }
          };

          const { data: tripNot, error: tripNotError } =
            await notificationsServices.createNotification(notificationData);

          // console.log("HEYYY 10101010", tripNot, error);

          if (tripNot) {
            io.emit("notification", tripNot);
          }
        }
      }
    }

    if (data) {
      responseService.created(
        res,
        "Bus Location Updated Successfully!",
        data[0]
      );
    }
  } catch (err) {
    next(err);
  }
};

export const getBusNodeById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const node_id = req.params.node_id;

    const { data, error } = await busNodesService.getBusNodeById(node_id);

    if (!data?.length) {
      return responseService.notFoundError(res, "Bus Node Node doesn't exist");
    }

    if (error) {
      return responseService.internalServerError(
        res,
        "Unexpected Error happened"
      );
    }

    responseService.success(res, "Bus Node Fetched Successfully!", data);
  } catch (err) {
    next(err);
  }
};

export const updateLocationPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("HEYYY handle by post");
    const node_id = req.params.node_id;

    const { location } = req.body;
    const update = {
      location
    };

    console.log("HEYYY 222", update);

    // Updates bus location
    const propertiesToReturn = Object.keys(update).join(" ");
    let { data, error } = await busNodesService.editBusNode(
      node_id,
      update,
      propertiesToReturn
    );

    console.log("HWYYY 333", data);
    if (error) {
      return responseService.internalServerError(
        res,
        "Unexpected Error happened"
      );
    }

    // Updates ongoing trip bus is on
    // get trip the bus is on and update its actual path
    // Send notification if bus leaves geofence
    const { data: tripData, error: tripError } =
      await tripsServices.getOnGoingTripByBusId(
        node_id,
        `
          id,
          actual_path,
          route(
            geo_fence(bound)
          )
        `
      );

    if (tripError) {
      return responseService.internalServerError(
        res,
        "Unexpected Error happened"
      );
    }

    // [FIX]! type
    if (tripData) {
      // @ts-ignore
      let trData: Pick<TripType, "actual_path" | "id"> & {
        route: {
          geo_fence: {
            bound: RECTANGLE_BOUND;
          };
        };
      } = tripData;

      await tripsServices.editTrip(trData.id, {
        actual_path: [...trData.actual_path, location]
      });

      const tripEvent = tripsEventClients.find(
        (tr) => tr.trip_id === trData.id
      );

      if (tripEvent) {
        const resData = `data: ${JSON.stringify([location])}\n\n`;
        tripEvent.response.write(resData);
      }

      const isWithinGeoFence = checkIfBoundContains(
        trData.route.geo_fence.bound,
        location
      );

      if (!isWithinGeoFence) {
        const { data: tripNot, error: tripNotError } =
          await notificationsServices.getNotificationByTripId(trData.id);

        if (!tripNot) {
          const notificationData: GeofenceViolationNotification = {
            type: "GEOFENCE_VIOLATION",
            trip_id: trData.id,
            payload: {
              route_path: [...trData.actual_path, location]
            }
          };

          const { data: tripNot, error: tripNotError } =
            await notificationsServices.createNotification(notificationData);

          // console.log("HEYYY 10101010", tripNot, error);

          if (tripNot) {
            io.emit("notification", tripNot);
          }
        }
      }
    }

    if (data) {
      responseService.created(
        res,
        "Bus Location Updated Successfully!",
        data[0]
      );
    }
  } catch (err) {
    next(err);
  }
};
