import { Router } from "express";
import {
  createBusNode,
  getBusNodes,
  getBusNodeById,
  editBusNode,
  updateLocation
} from "../controllers/busNodes.controller";

const busNodeRouter = Router();

busNodeRouter.post("/", createBusNode);
busNodeRouter.get("/", getBusNodes);
busNodeRouter.get("/:node_id", getBusNodeById);
busNodeRouter.patch("/:node_id", editBusNode);
busNodeRouter.patch("/:node_id/location", updateLocation);

export default busNodeRouter;
