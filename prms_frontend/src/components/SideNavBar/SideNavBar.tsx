"use client";

import React from "react";
import LogoIcon from "@/svg-icons/logo.svg";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LocationIcon from "@/svg-icons/location.svg";
import RoutesIcon from "@/svg-icons/routes-icon.svg";
import GeofencingIcon from "@/svg-icons/shield.svg";
import LiveMonitorIcon from "@/svg-icons/monitor.svg";
import Alert from "@/svg-icons/alert.svg";

const routes: {
  label: string;
  href: string;
  icon: React.ReactElement;
}[] = [
  {
    label: "Bus Stops",
    href: "/bus-stops",
    icon: <LocationIcon />
  },
  {
    label: "Routes",
    href: "/routes",
    icon: <RoutesIcon />
  },
  {
    label: "Geofencing",
    href: "/geofencing",
    icon: <GeofencingIcon />
  },
  {
    label: "Trips",
    href: "/trips",
    icon: <RoutesIcon />
  },
  {
    label: "Live Monitor",
    href: "/live-monitor",
    icon: <LiveMonitorIcon />
  },
  {
    label: "Alerts",
    href: "/alerts",
    icon: <Alert />
  }
];

type PropType = {
  unreadNotificationCount: number;
};

const SideNavBar: React.FC<PropType> = ({ unreadNotificationCount }) => {
  const pathname = usePathname();

  return (
    <div className="bg-white border-r-1 border-gray-200">
      <div className="border-b-1 border-gray-200 p-6 flex items-center">
        <LogoIcon />

        <h2 className="ml-3 font-bold text-xl text-slate-900">PRMS</h2>
      </div>
      <div className="px-6 py-4">
        {routes.map((route) => (
          <Link
            key={route.label}
            href={route.href}
            className={`mt-2 flex px-3 py-2.5 items-center justify-between rounded-lg  ${pathname === route.href ? "bg-blue-50 border-r-3 border-blue-700" : ""}`}
          >
            <div className="flex items-center">
              {route.icon}
              <span className="ml-3 text-base text-slate-600">
                {route.label}
              </span>
            </div>
            {route.href === "/alerts" && unreadNotificationCount > 0 && (
              <span className="bg-red-500 text-xs rounded-full py-0.5 px-2 text-white">
                {unreadNotificationCount}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SideNavBar;
