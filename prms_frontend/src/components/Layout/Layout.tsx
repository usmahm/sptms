"use client";

import React, { useEffect } from "react";
import SideNavBar from "../SideNavBar/SideNavBar";
import PageHeader from "../PageHeader/PageHeader";
import useNotificationsStore from "@/store/useNotificationsStore";
import { useShallow } from "zustand/shallow";

export const Layout: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const {
    subscribeToNotifications,
    unsubscribeFromNotifications,
    unreadCount,
    fetchUnreadNotificationsCount
  } = useNotificationsStore(
    useShallow((state) => ({
      unreadCount: state.unreadCount,
      unsubscribeFromNotifications: state.unsubscribeFromNotifications,
      subscribeToNotifications: state.subscribeToNotifications,
      fetchUnreadNotificationsCount: state.fetchUnreadNotificationsCount
    }))
  );

  useEffect(() => {
    fetchUnreadNotificationsCount();
    subscribeToNotifications();

    return () => unsubscribeFromNotifications();
  });

  return (
    <div className="grid grid-cols-[255px_1fr] h-full">
      <SideNavBar unreadNotificationCount={unreadCount} />
      <div className="flex flex-col">
        <PageHeader />

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};
