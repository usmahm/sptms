import { Response } from "express";

const responseService = {
  statusCodes: {
    ok: 200,
    created: 201,
    accepted: 202,
    noContent: 204,
    badResponse: 400,
    unauthorized: 401,
    forbidden: 403,
    notFound: 404,
    internalServerError: 500,
    serviceUnavailable: 503
  },

  success(res: Response, message: string, data?: any) {
    const resp = {
      success: true,
      message,
      data,
      status: this.statusCodes.ok
    };

    res.status(resp.status).json(resp);
  },

  created(res: Response, message: string, data?: any) {
    const resp = {
      success: true,
      message,
      data,
      status: this.statusCodes.created
    };

    res.status(resp.status).json(resp);
  },

  error(res: Response, message: string, error: any) {
    const resp = {
      success: false,
      message,
      error,
      status: this.statusCodes.badResponse
    };

    res.status(resp.status).json(resp);
  },

  unauthorizedError(res: Response, message: string) {
    const resp = {
      success: false,
      message,
      error: "Unauthorized",
      status: this.statusCodes.unauthorized
    };

    res.status(resp.status).json(resp);
  },

  forbiddenError(res: Response, message: string) {
    const resp = {
      success: false,
      message,
      error: "Forbidden",
      status: this.statusCodes.forbidden
    };

    res.status(resp.status).json(resp);
  },

  notFoundError(res: Response, message: string) {
    const resp = {
      success: false,
      message,
      error: "Not Found",
      status: this.statusCodes.notFound
    };

    res.status(resp.status).json(resp);
  },

  internalServerError(res: Response, message: string) {
    const resp = {
      success: false,
      message,
      error: "Internal Server Error",
      status: this.statusCodes.internalServerError
    };

    res.status(resp.status).json(resp);
  },

  serviceUnavailableError(res: Response, message: string) {
    const resp = {
      success: false,
      message,
      error: "Service Unavailable",
      status: this.statusCodes.serviceUnavailable
    };

    res.status(resp.status).json(resp);
  }
};

export default responseService;
