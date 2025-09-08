import { Request, Response, NextFunction } from "express";

const logger = (req: Request, res: Response, next: NextFunction) => {
  res.on("finish", () => {
    const response = {
      statusCode: res.statusCode,
      message: res.statusMessage,
      body: res.locals.body
    };
    const log = `
============================
${req.method}: ${req.originalUrl}
BODY: ${JSON.stringify(req.body)}
RESPONSE: ${JSON.stringify(response)}
============================
    `;

    console.log(log);
  });
  next();
};

export default logger;
