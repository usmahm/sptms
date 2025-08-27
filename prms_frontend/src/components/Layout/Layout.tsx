import React from "react";
import SideNavBar from "../SideNavBar/SideNavBar";
import PageHeader from "../PageHeader/PageHeader";

export const Layout: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  return (
    <div className="grid grid-cols-[255px_1fr] h-full">
      <SideNavBar />
      <div className="flex flex-col">
        <PageHeader />

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};
