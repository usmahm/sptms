import { Router } from "express";
import {
  createBusNode,
  getBusNodes,
  getBusNodeById
} from "../controllers/busNodes.controller";

const busNodeRouter = Router();

busNodeRouter.post("/", createBusNode);
busNodeRouter.get("/", getBusNodes);
busNodeRouter.get("/:node_id", getBusNodeById);

export default busNodeRouter;
