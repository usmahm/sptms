import { Router, Request, Response } from "express";
// import busesRoutes from "./busStops.routes";
import busNodesRouter from "./busNodes.routes";
import busStopsRouter from "./busStops.routes";
import routesRouter from "./routes.routes";
import tripsRouter from "./trips.routes";
import geofencesRouter from "../routes/geoFences.routes";

const router = Router();

router.use("/bus-nodes", busNodesRouter);
router.use("/bus-stops", busStopsRouter);
router.use("/routes", routesRouter);
router.use("/trips", tripsRouter);
router.use("/geo-fences", geofencesRouter);

export default router;
