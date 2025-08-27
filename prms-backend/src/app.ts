import express, { Request, Response } from "express";
import cors from "cors";
import logger from "./middleware/logger";
// import config from "./config/config";

import { errorHandler } from "./middleware/error-handler";
import responseService from "./utils/responseService";
import router from "./routes/routes";
import config from "./config/config";

const app = express();

// const corsOption = {
//   credentials: true,
//   origin: ["http://localhost:3000", config.FRONTEND_ORIGIN]
// };

// Check how to make this work or if it works wih iot device (esp)
// app.use(cors(corsOption));
app.use(cors());
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
