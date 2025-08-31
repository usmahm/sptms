import { Router } from "express";
import {
  createGeofence,
  getGeofences,
  getGeofenceById,
  editGeofence
} from "../controllers/geoFences.controller";

const geofencesRouter = Router();

geofencesRouter.post("/", createGeofence);
geofencesRouter.get("/", getGeofences);
geofencesRouter.get("/:geofence_id", getGeofenceById);
geofencesRouter.patch("/:geofence_id", editGeofence);

export default geofencesRouter;
