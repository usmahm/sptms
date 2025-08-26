import { Router } from "express";
import {
  createTrip,
  getTrip,
  getTripById,
  editTrip
} from "../controllers/trips.controller";

const tripsRouter = Router();

tripsRouter.post("/", createTrip);
tripsRouter.get("/", getTrip);
tripsRouter.get("/:trip_id", getTripById);
tripsRouter.patch("/:trip_id", editTrip);

export default tripsRouter;
