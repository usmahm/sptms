"use client";

import Button from "../UI/Button/Button";
import { useEffect, useState } from "react";
import CreateRoute from "../Forms/CreateRoute";
import LoadingSpinner from "../UI/LoadingSpinner/LoadingSpinner";
import RouteCard from "../Cards/RouteCard";
import useRoutesStore from "@/store/useRoutesStore";
import { useShallow } from "zustand/shallow";

enum VIEW_TYPES {
  LIST,
  FORM
}

const RouteList = () => {
  const { loadingRoutes, routes } = useRoutesStore(
    useShallow((state) => ({
      loadingRoutes: state.loadingRoutes,
      routes: state.routes
    }))
  );

  if (loadingRoutes) {
    return (
      <div className="w-full flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-4">
      {routes.map((route) => (
        <RouteCard route={route} />
      ))}
    </div>
  );
};

const RouteScreen = () => {
  const [view, setView] = useState<VIEW_TYPES>(VIEW_TYPES.LIST);
  const { loadRoutes, editingRoute, routes } = useRoutesStore(
    useShallow((state) => ({
      loadRoutes: state.loadRoutes,
      editingRoute: state.editingRoute,
      routes: state.routes
    }))
  );

  useEffect(() => {
    if (!routes.length) {
      loadRoutes();
    }
  }, []);

  let toRender = <RouteList />;
  if (view === VIEW_TYPES.FORM) {
    toRender = (
      <CreateRoute
        onCancel={() => setView(VIEW_TYPES.LIST)}
        routeData={editingRoute}
        onCreateRoute={() => {
          setView(VIEW_TYPES.LIST);
        }}
      />
    );
  }

  return (
    <div className="h-full bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Routes</h1>
          <p className="text-slate-600 text-base">
            Define and manage routes between bus stops
          </p>
        </div>

        {view === VIEW_TYPES.LIST && (
          <Button
            label="+ Add Route"
            onClick={() => setView(VIEW_TYPES.FORM)}
          />
        )}
      </div>
      {toRender}
    </div>
  );
};

export default RouteScreen;
