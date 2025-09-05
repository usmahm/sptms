import { NextFunction, Request, Response } from "express";
import busNodesService from "../services/busNodes.services";
import responseService from "../utils/responseService";
import { BusType, LAT_LNG_TYPE, TripType } from "../types/types";
import tripsServices from "../services/trips.services";
import { Tables } from "../types/database.types";
import { tripsEventClients } from "./trips.controller";

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

    // Updates ongoing trips bus is on
    // get trips the bus is on and update its actual path
    const { data: tripData, error: tripError } =
      await tripsServices.getOnGoingTripByBusId(node_id, "id, actual_path");

    if (tripError) {
      return responseService.internalServerError(
        res,
        "Unexpected Error happened"
      );
    }

    // [FIX]! hack fix later
    if (tripData) {
      // @ts-ignore
      let trData: Pick<TripType, "actual_path" | "id">[] = tripData;

      const promises = trData.map((tr) =>
        tripsServices.editTrip(tr.id, {
          actual_path: [...tr.actual_path, location]
        })
      );

      await Promise.all(promises);

      // alerts all clients subscribed to SSE on trips

      const updatedTrips: { [key: string]: LAT_LNG_TYPE[] } = {};
      for (const tr of trData) {
        updatedTrips[tr.id] = tr.actual_path;
      }

      tripsEventClients.map((event) => {
        if (event.trip_id in updatedTrips) {
          const resData = `data: ${JSON.stringify([location])}\n\n`;
          event.response.write(resData);
        }
      });
    }

    if (data) {
      responseService.created(res, "Bus Node Edited Successfully!", data[0]);
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
