import express, { Request, Response } from "express";
import logger from "./middleware/logger";
// import config from "./config/config";

import { errorHandler } from "./middleware/error-handler";
import responseService from "./utils/responseService";
import router from "./routes/routes";

const app = express();

app.use(express.json());
app.use(logger);

app.use("/api", router);

app.get("/health", (req: Request, res: Response) => {
  res.send("Hello, I am healthy!");
});

app.use(errorHandler);

app.use(function (req: Request, res: Response) {
  responseService.notFoundError(res, "Invalid Request");
});

export default app;
