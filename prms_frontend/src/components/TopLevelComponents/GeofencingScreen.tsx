"use client";

import { useEffect, useState } from "react";
import Button from "../UI/Button/Button";
import LocationIcon from "@/svg-icons/location.svg";
import EditIcon from "@/svg-icons/edit.svg";
import DeleteIcon from "@/svg-icons/delete.svg";
import CreateGeofence from "../Forms/CreateGeofence";
import GeofenceCard from "../Cards/GeofenceCard";
import LoadingSpinner from "../UI/LoadingSpinner/LoadingSpinner";
import MapComponent from "../MapComponent/MapComponent";
import { PLOT_ROUTE_TYPE } from "../PlotRoute/PlotRoute";
import { useShallow } from "zustand/shallow";
import useGeofenceStore, { GeofenceType } from "@/store/useGeofenceStore";

enum VIEW_TYPES {
  LIST,
  FORM
}

// Make this user location
const center = {
  lat: 7.501217,
  lng: 4.502154
};

const GeoFencingList = ({
  selectedGeofence,
  onSelectGeofence
}: {
  onSelectGeofence: (geofence: GeofenceType) => void;
  selectedGeofence?: GeofenceType;
}) => {
  const { loadingGeofences, geofences } = useGeofenceStore(
    useShallow((state) => ({
      loadingGeofences: state.loadingGeofences,
      geofences: state.geofences
    }))
  );

  let routesToPlot: PLOT_ROUTE_TYPE[] = [];
  if (selectedGeofence) {
    // const routeData = selectedGeofence.route;
    // if (routeData) {
    //   routesToPlot = [
    //     {
    //       origin: routeData.expected_path[0],
    //       originLabel: "Origin",
    //       destination:
    //         routeData.expected_path[routeData.expected_path.length - 1],
    //       destinationLabel: "Destination",
    //       path: routeData.expected_path,
    //       color: "#FF0000",
    //       visible: true
    //     }
    //   ];
    // }
  }

  return (
    <div className="grid grid-cols-[329px_1fr] gap-x-6 ">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 p-4">
          <h3 className="text-slate-900 text-base font-semibold">Geofences</h3>
        </div>

        {loadingGeofences ? (
          <div className="w-full flex justify-center mt-3">
            <LoadingSpinner />
          </div>
        ) : (
          geofences.map((g) => (
            <GeofenceCard
              key={g.id}
              geoFence={g}
              onClick={() => onSelectGeofence(g)}
            />
          ))
        )}
      </div>

      <div className="bg-white rounded-t-lg border border-gray-200 h-full overflow-hidden">
        <div className="flex justify-between items-center border-b border-gray-200 p-4">
          <h3 className="text-slate-900 text-base font-semibold">
            Select a geofence to view
          </h3>

          <div className="flex justify-between">
            <button
              className="flex justify-center items-center w-8 h-8"
              onClick={() => {}}
            >
              <EditIcon />
            </button>
            <button
              className="flex justify-center items-center w-8 h-8"
              onClick={() => {}}
            >
              <DeleteIcon />
            </button>
          </div>
        </div>
        <div className="h-100  bg-blue-50">
          {selectedGeofence ? (
            <MapComponent
              center={center}
              routesToPlot={routesToPlot}
              geofenceBounds={selectedGeofence.bound}
            />
          ) : (
            <div className="h-full w-full flex flex-col justify-center items-center">
              <LocationIcon w-64 h-64 />
              <p className="text-base text-slate-500 mt-6">
                Select a geofence from the list to view details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const GeofencingScreen = () => {
  const { loadGeofences, geofences, editingGeofence } = useGeofenceStore(
    useShallow((state) => ({
      loadGeofences: state.loadGeofences,
      geofences: state.geofences,
      editingGeofence: state.editingGeofence
    }))
  );
  const [view, setView] = useState<VIEW_TYPES>(VIEW_TYPES.LIST);
  const [selectedGeofence, setSelectedGeofence] = useState<
    GeofenceType | undefined
  >(undefined);

  useEffect(() => {
    if (!geofences.length) {
      loadGeofences();
    }
  }, []);

  let toRender = (
    <GeoFencingList
      selectedGeofence={selectedGeofence}
      onSelectGeofence={(g) => setSelectedGeofence(g)}
    />
  );
  if (view === VIEW_TYPES.FORM) {
    toRender = (
      <CreateGeofence
        onCancel={() => setView(VIEW_TYPES.LIST)}
        geoFenceData={editingGeofence}
        onCreateGeofence={() => {
          setView(VIEW_TYPES.LIST);
        }}
      />
    );
  }

  return (
    <div className="h-full bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Geofencing</h1>
          <p className="text-slate-600 text-base">
            Draw and manage geofences around routes and stops
          </p>
        </div>

        {view === VIEW_TYPES.LIST && (
          <Button
            label="+ Create Geofence"
            onClick={() => setView(VIEW_TYPES.FORM)}
          />
        )}
      </div>

      {toRender}
    </div>
  );
};

export default GeofencingScreen;
