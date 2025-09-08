import { Request, Response, NextFunction } from "express";

const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method}: ${req.path}`);
  if (req.body) {
    console.log("BODY:", req.body);
  }
  next();
};

export default logger;
