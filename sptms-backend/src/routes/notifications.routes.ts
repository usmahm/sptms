import { Router } from "express";
import {
  createNotification,
  getNotifications,
  markNotificationsRead,
  getUnreadNotificationsCount
} from "../controllers/notifications.controller";

const notificationRouter = Router();

notificationRouter.post("/", createNotification);
notificationRouter.get("/", getNotifications);
notificationRouter.get("/count", getUnreadNotificationsCount);
notificationRouter.patch("/read", markNotificationsRead);

export default notificationRouter;
