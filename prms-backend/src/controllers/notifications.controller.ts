import { NextFunction, Request, Response } from "express";
import notificationsServices, {
  BusOfflineNotification,
  GeofenceViolationNotification
} from "../services/notifications.services";
import responseService from "../utils/responseService";

export const createNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { type, bus_id, trip_id, payload } = req.body;

    let notificationData:
      | BusOfflineNotification
      | GeofenceViolationNotification;
    if (type === "BUS_OFFLINE") {
      notificationData = {
        type,
        bus_id,
        payload
      };
    } else {
      notificationData = {
        type,
        trip_id,
        payload
      };
    }

    const { data, error } =
      await notificationsServices.createNotification(notificationData);
    if (error) {
      return responseService.internalServerError(
        res,
        "Unexpected Error happened"
      );
    }

    responseService.created(res, "Notification Created Successfully!", data);
  } catch (err) {
    next(err);
  }
};

interface GetNotificationsQuery {
  unread?: boolean;
  after?: string;
}

export const getNotifications = async (
  req: Request<{}, {}, {}, GetNotificationsQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const unread = req.query.unread;
    const after = req.query.after;

    const { data, error } = await notificationsServices.getAllNotification({
      unread,
      after
    });

    if (error) {
      return responseService.internalServerError(
        res,
        "Unexpected Error happened"
      );
    }

    responseService.success(res, "Notifications Fetched Successfully!", data);
  } catch (err) {
    next(err);
  }
};

export const getUnreadNotificationsCount = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("HEYYYYY sdsd");
    const { count, error } =
      await notificationsServices.getUnreadNotificationsCount();

    console.log("HEYYY 111", count);
    if (error) {
      return responseService.internalServerError(
        res,
        "Unexpected Error happened"
      );
    }

    responseService.success(
      res,
      "Unread Notifications Count Fetched Successfully!",
      { count }
    );
  } catch (err) {
    next(err);
  }
};

export const markNotificationsRead = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { data, error } = await notificationsServices.markNotificationRead();

    if (error) {
      return responseService.internalServerError(
        res,
        "Unexpected Error happened"
      );
    }

    responseService.success(res, "Unread Notifications Updated Successfully!");
  } catch (err) {
    next(err);
  }
};
