"use client";
import useNotificationsStore from "@/store/useNotificationsStore";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";
import LoadingSpinner from "../UI/LoadingSpinner/LoadingSpinner";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(LocalizedFormat);

const AlertsScreen = () => {
  const { notifications, loadNotifications, loadingNotifications } =
    useNotificationsStore(
      useShallow((state) => ({
        notifications: state.notifications,
        loadingNotifications: state.loadingNotifications,
        loadNotifications: state.loadNotifications
      }))
    );

  useEffect(() => {
    const latest = !!notifications.length;
    loadNotifications(latest);
  }, []);

  return (
    <div className="h-full bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Alert System</h1>
          <p className="text-slate-600 text-base">
            Monitor and manage system alerts and notifications
          </p>
        </div>
      </div>

      {loadingNotifications && !notifications.length && (
        <div className="w-full flex justify-center">
          <LoadingSpinner />
        </div>
      )}

      {notifications.length
        ? notifications.map((n) => {
            if (n.type === "GEOFENCE_VIOLATION") {
              return (
                <div
                  key={n.id}
                  className="bg-red-100 py-4 px-5 rounded-lg border-l-4 border-red-500"
                >
                  <p className="text-base font-bold text-slate-900 mb-1">
                    {n.type.split("_").join(" ")}
                  </p>
                  <p className="text-base text-slate-600">
                    Bus #{n.trip.bus.code} has deviated from the designated
                    route
                  </p>
                  <span className="flex items-center gap-5">
                    <p className="text-sm text-slate-600">
                      Bus #{n.trip.bus.code}
                    </p>
                    <p className="text-sm text-slate-600">
                      Route: {n.trip.route.start_bus_stop.name} -{" "}
                      {n.trip.route.end_bus_stop.name}
                    </p>
                    <p className="text-sm text-slate-600">
                      {dayjs(n.created_at).format("lll")}
                    </p>
                  </span>
                </div>
              );
            }

            return null;
          })
        : null}
    </div>
  );
};

export default AlertsScreen;
