import { NextFunction, Request, Response } from "express";
import busNodesService from "../services/busNodes.services";
import responseService from "../utils/responseService";
import { BusType } from "../types/types";

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
      console.log("HEYYY 111", error);

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

export const getBusNodeById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const node_id = req.params.node_id;
    console.log("HEYYY 111", node_id);

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
