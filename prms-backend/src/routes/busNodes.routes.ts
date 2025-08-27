import { Router } from "express";
import {
  createBusNode,
  getBusNodes,
  getBusNodeById,
  editBusNode
} from "../controllers/busNodes.controller";

const busNodeRouter = Router();

busNodeRouter.post("/", createBusNode);
busNodeRouter.get("/", getBusNodes);
busNodeRouter.get("/:node_id", getBusNodeById);
busNodeRouter.patch("/:node_id", editBusNode);

export default busNodeRouter;
