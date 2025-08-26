import { Router } from "express";
import {
  createBusStop,
  getBusStops,
  getBusStopById
} from "../controllers/busStops.controller";

const busNodeRouter = Router();

busNodeRouter.post("/", createBusStop);
busNodeRouter.get("/", getBusStops);
busNodeRouter.get("/:node_id", getBusStopById);

export default busNodeRouter;
