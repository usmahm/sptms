import { Router } from "express";
import {
  createRoute,
  getRoutes,
  getRouteById,
  editRoute
} from "../controllers/routes.controller";

const routesRouter = Router();

routesRouter.post("/", createRoute);
routesRouter.get("/", getRoutes);
routesRouter.get("/:route_id", getRouteById);
routesRouter.patch("/:route_id", editRoute);

export default routesRouter;
