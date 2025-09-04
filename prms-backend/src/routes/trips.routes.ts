import { Router } from "express";
import {
  createTrip,
  getTrips,
  getTripById,
  editTrip,
  tripsPathEventHandler
} from "../controllers/trips.controller";

const tripsRouter = Router();

tripsRouter.post("/", createTrip);
tripsRouter.get("/", getTrips);
tripsRouter.get("/path/events/:trip_id", tripsPathEventHandler);
tripsRouter.get("/:trip_id", getTripById);
tripsRouter.patch("/:trip_id", editTrip);

export default tripsRouter;
