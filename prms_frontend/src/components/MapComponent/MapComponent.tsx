"use client";
import {
  DirectionsRenderer,
  DrawingManager,
  GoogleMap,
  Libraries,
  useJsApiLoader
} from "@react-google-maps/api";
import React, { useCallback, useEffect, useRef, useState } from "react";
import PlotRoute, { PLOT_ROUTE_TYPE } from "../PlotRoute/PlotRoute";
import { LAT_LNG_TYPE } from "@/types";
import { Rectangle } from "@react-google-maps/api";
import CustomMarker, { MARKER_PROP_TYPE } from "../CustomMarker/CustomMarker";
import { RECTANGLE_BOUND } from "@/utils/utils";

const containerStyle = {
  width: "100%",
  height: "100%",
  flex: 1
};

export enum ACTION_TYPES {
  SELECT_POINT,
  DRAWING_RECTANGLE
}

// [FIX]! improve the typing here!!!!
type PropType = {
  center: LAT_LNG_TYPE;
  actionMode?: ACTION_TYPES;
  onSelectPoint?: (e: google.maps.MapMouseEvent) => void;
  onDrawRectangle?: (rectangleBound: RECTANGLE_BOUND) => void;
  directionResult?: google.maps.DirectionsResult; // [FIX]! change to plot route component
  markers?: MARKER_PROP_TYPE[];
  routesToPlot?: PLOT_ROUTE_TYPE[];
  isWithinGeoFence?: boolean;
  geofenceBounds?: google.maps.LatLngBounds;
};

const MapComponent: React.FC<PropType> = ({
  center,
  actionMode,
  onDrawRectangle,
  onSelectPoint,
  directionResult,
  markers,
  routesToPlot,
  isWithinGeoFence,
  geofenceBounds
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const geofenceRectRef = useRef<google.maps.Rectangle | null>(null);
  const rectChangesEventListenerRef =
    useRef<google.maps.MapsEventListener | null>(null);
  const [gLibraries] = useState<Libraries>(["drawing"]);

  // commented out something I am not sure of here
  const onLoad = useCallback(function callback(map: google.maps.Map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    // map.setOptions({ });
    // setMap(map);
  }, []);

  const onUnmount = useCallback(function callback() {
    console.log(map);
    setMap(null);
  }, []);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: gLibraries
  });

  const handleGeofenceRectChange = () => {
    if (onDrawRectangle && geofenceRectRef.current) {
      const res = geofenceRectRef.current.getBounds();

      if (res) {
        onDrawRectangle({
          southWest: res.getSouthWest().toJSON(),
          northEast: res.getNorthEast().toJSON()
        });
      }
    }
  };

  const onRectangleComplete = (rect: google.maps.Rectangle) => {
    geofenceRectRef.current = rect;

    // remove previous listener
    if (rectChangesEventListenerRef.current) {
      rectChangesEventListenerRef.current.remove();
    }

    rectChangesEventListenerRef.current = rect.addListener(
      "bounds_changed",
      handleGeofenceRectChange
    );

    handleGeofenceRectChange();
  };

  const heyy: google.maps.RectangleOptions = {};

  // [FIX]! This should be done outside this component wherever it is needed
  useEffect(() => {
    if (!geofenceRectRef.current) return;
    const color = isWithinGeoFence ? "#008000" : "#FF0000";

    geofenceRectRef.current.setOptions({
      strokeColor: color,
      fillColor: color
    });
  }, [isWithinGeoFence, geofenceRectRef]);

  if (typeof window === undefined || !isLoaded) {
    return <div className="h-full w-full bg-white" />;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      onLoad={onLoad}
      onUnmount={onUnmount}
      onClick={onSelectPoint}
    >
      {directionResult && (
        <DirectionsRenderer
          options={{
            directions: directionResult
          }}
        />
      )}

      {markers &&
        markers.map((marker) => (
          <CustomMarker key={JSON.stringify(marker.position)} {...marker} />
        ))}

      {routesToPlot &&
        routesToPlot.map((route) => (
          <PlotRoute key={route.path.toString()} {...route} />
        ))}

      {geofenceBounds && (
        <Rectangle
          bounds={geofenceBounds}
          options={{
            // editable: true,
            // draggable: true,
            strokeColor: isWithinGeoFence ? "#008000" : "#FF0000",
            fillColor: isWithinGeoFence ? "#008000" : "#FF0000"
          }}
        />
      )}

      <DrawingManager
        drawingMode={
          actionMode === ACTION_TYPES.DRAWING_RECTANGLE
            ? google.maps.drawing.OverlayType.RECTANGLE
            : null
        }
        onRectangleComplete={onRectangleComplete}
        options={{
          drawingControl: false,
          rectangleOptions: {
            editable: true,
            draggable: true,
            strokeColor: "#008000",
            fillColor: "#008000"
          }
        }}
      />
    </GoogleMap>
  );
};

export default MapComponent;
