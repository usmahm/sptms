"use client";

import Button from "../UI/Button/Button";
import { useEffect, useState } from "react";
import CreateRoute, { RouteType } from "../Forms/CreateRoute";
import api, { ApiResponse } from "@/api/api";
import { toast } from "react-toastify";
import LoadingSpinner from "../UI/LoadingSpinner/LoadingSpinner";
import RouteCard from "../Cards/RouteCard";

enum VIEW_TYPES {
  LIST,
  FORM
}

const RouteList = ({
  routes,
  loading
}: {
  routes: RouteType[];
  loading: boolean;
}) => {
  if (loading) {
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
  const [routes, setRoutes] = useState<RouteType[]>([]);
  const [loadingRoutes, setLoadingRoutes] = useState(true);
  const [editingRoute, setEditingRoute] = useState<RouteType | undefined>(
    undefined
  );

  const loadRoutes = async () => {
    try {
      const response: ApiResponse<RouteType[]> = await api.get("/routes");
      if (response.success) {
        console.log("routes", response);

        setRoutes(response.data);
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error("Unable to fetch routes!");
    } finally {
      setLoadingRoutes(false);
    }
  };

  useEffect(() => {
    loadRoutes();
  }, []);

  let toRender = <RouteList routes={routes} loading={loadingRoutes} />;
  if (view === VIEW_TYPES.FORM) {
    toRender = (
      <CreateRoute
        onCancel={() => setView(VIEW_TYPES.LIST)}
        routeData={editingRoute}
        onCreateRoute={(newRoute) => {
          setRoutes((prev) => [newRoute, ...prev]);
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
