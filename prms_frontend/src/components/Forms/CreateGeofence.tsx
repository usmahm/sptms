import React, { useEffect, useState } from "react";
import DropDown, { OptionType } from "../UI/DropDown/DropDown";
import Input from "../UI/Input/Input";
import Button from "../UI/Button/Button";
import api, { ApiResponse } from "@/api/api";
import { RouteType } from "./CreateRoute";
import { toast } from "react-toastify";
import MapComponent, { ACTION_TYPES } from "../MapComponent/MapComponent";
import { PLOT_ROUTE_TYPE } from "../PlotRoute/PlotRoute";
import { RECTANGLE_BOUND } from "@/utils/utils";

// Make this user location
const center = {
  lat: 7.501217,
  lng: 4.502154
};

export const GEOFENCE_TYPES: { [key: string]: OptionType } = {
  ROUTE_PROTECTION: { label: "Route Protection", value: "ROUTE_PROTECTION" },
  STOP_MONITORING: { label: "Stop Monitoring", value: "STOP_MONITORING" }
};

const statusOptions = [
  { label: "Inactive", value: "INACTIVE" },
  { label: "Active", value: "ACTIVE" }
];

export type GeofenceType = {
  name: string;
  status: string;
  type: string;
  route: string;
  id: string;
};

type CreateGeoFenceType = {
  onCancel: () => void;
  geoFenceData?: GeofenceType;
  onCreateGeofence: (geoFence: GeofenceType) => void;
};

const CreateGeofence: React.FC<CreateGeoFenceType> = ({
  onCreateGeofence,
  onCancel
}) => {
  const [loadingRoutes, setLoadingRoutes] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [geofenceBound, setGeofenceBound] = useState<RECTANGLE_BOUND | null>(
    null
  );
  const [name, setName] = useState("");
  const [status, setStatus] = useState<OptionType | null>(null);
  const [geofenceType, setGeofenceType] = useState<OptionType | null>(null);
  const [route, setRoute] = useState<OptionType | null>(null);
  const [routes, setRoutes] = useState<RouteType[]>([]);

  const onSubmitHandler = async () => {
    try {
      setSubmitting(true);

      if (name && route && geofenceType && status && geofenceBound) {
        const geofenceData = {
          name,
          status: status.value,
          type: geofenceType.value,
          route: route.value,
          bound: geofenceBound
        };

        const response: ApiResponse<GeofenceType[]> = await api.post(
          "/geo-fences",
          geofenceData
        );

        // console.log("geofenceData", response);
        if (response.success) {
          toast.success("Geofence Created Successfully!");
          onCreateGeofence(response.data[0]);
        } else {
          throw new Error();
        }
      }
    } catch (err) {
      console.log("HEYYY sds", err);
      toast.error("Unable to create Geofence!");
    } finally {
      setSubmitting(false);
    }
  };

  const loadRoutes = async () => {
    try {
      const response: ApiResponse<RouteType[]> = await api.get("/routes");
      if (response.success) {
        // console.log("routes", response);

        setRoutes(response.data);
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error("Unable to fetch routes, please reload!");
    } finally {
      setLoadingRoutes(false);
    }
  };

  useEffect(() => {
    loadRoutes();
  }, []);

  useEffect(() => {
    console.log("HEYYYY", geofenceBound);
  }, [geofenceBound]);

  let routesToPlot: PLOT_ROUTE_TYPE[] = [];
  if (route) {
    const routeData = routes.find((r) => (r.id = route.value));

    if (routeData) {
      routesToPlot = [
        {
          origin: routeData.expected_path[0],
          originLabel: "Origin",
          destination:
            routeData.expected_path[routeData.expected_path.length - 1],
          destinationLabel: "Destination",
          path: routeData.expected_path,
          color: "#FF0000",
          visible: true
        }
      ];
    }
  }

  let done = false;
  if (name && route && geofenceType && status && geofenceBound) done = true;
  return (
    <div>
      <p className="text-xl font-semibold mb-4">Create New Geofence</p>

      <div>
        <div className="flex gap-4">
          <Input
            id="name"
            value={name}
            onChange={(v) => setName(v)}
            label="Name"
          />
          <DropDown
            label="Route"
            value={route ? route.label : ""}
            placeholder="Select route"
            disabled={loadingRoutes || !routes.length}
            options={routes.map((r) => ({
              label: r.name,
              value: r.id
            }))}
            onClick={(v) => setRoute(v)}
          />
        </div>

        <div className="flex gap-4 mt-4">
          <DropDown
            label="Type"
            value={geofenceType ? geofenceType.label : ""}
            placeholder="Select Geofence Type"
            options={Object.values(GEOFENCE_TYPES)}
            onClick={(v) => setGeofenceType(v)}
          />
          <DropDown
            label="Status"
            value={status ? status.label : ""}
            placeholder="Select Status"
            options={statusOptions}
            onClick={(v) => setStatus(v)}
          />
        </div>
        <div className="h-80 border border-gray-200 rounded-lg mt-4">
          <MapComponent
            center={center}
            actionMode={
              !geofenceBound && route
                ? ACTION_TYPES.DRAWING_RECTANGLE
                : undefined
            }
            onDrawRectangle={(rectBound) => {
              setGeofenceBound(rectBound);
            }}
            // markers={markers}
            routesToPlot={routesToPlot}
          />
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <Button
          label="Create Geofence"
          onClick={onSubmitHandler}
          disabled={!done}
          loading={submitting}
        />
        <Button label="Cancel" onClick={onCancel} />
      </div>
    </div>
  );
};

export default CreateGeofence;
