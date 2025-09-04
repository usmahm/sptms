import { Router } from "express";
import {
  createBusStop,
  getBusStops,
  getBusStopById
} from "../controllers/busStops.controller";

const busNodeRouter = Router();

busNodeRouter.post("/", createBusStop);
busNodeRouter.get("/", getBusStops);
busNodeRouter.get("/:stop_id", getBusStopById);

// Get all buses scheduled for future departure from this bus station today.
// i.e buses that has trip but has not started
// /bus-stops/:id/trips?future=true
// busNodeRouter.get("/:stop_id/trips?futureDeparture=true", getBusStopTrips);

export default busNodeRouter;
