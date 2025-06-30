import {
  DirectionsRenderer,
  DrawingManager,
  GoogleMap,
  useJsApiLoader,
} from "@react-google-maps/api";
import React, { useCallback, useState } from "react";
import PlotRoute, { PLOT_ROUTE_TYPE } from "../PlotRoute/PlotRoute";
import { LAT_LNG_TYPE } from "@/types";
import CustomMarker, { MARKER_PROP_TYPE } from "../CustomMarker/CustomMarker";

const containerStyle = {
  width: "100%",
  height: "100%",
  flex: 1,
};

export enum ACTION_TYPES {
  SELECT_POINT,
  DRAWING_RECTANGLE,
}

type PropType = {
  center: LAT_LNG_TYPE;
  actionMode?: ACTION_TYPES;
  onSelectPoint: (e: google.maps.MapMouseEvent) => void;
  onDrawRectangle: (rectangle: google.maps.Rectangle) => void;
  directionResult?: google.maps.DirectionsResult; // [FIX]! change to plot route component
  markers: MARKER_PROP_TYPE[];
  routesToPlot: PLOT_ROUTE_TYPE[];
};

const MapComponent: React.FC<PropType> = ({
  center,
  actionMode,
  onDrawRectangle,
  onSelectPoint,
  directionResult,
  markers,
  routesToPlot,
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback() {
    console.log(map);
    setMap(null);
  }, []);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["drawing"],
  });

  console.log("HEYYY kkk", actionMode);
  return (
    <>
      {isLoaded && (
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
                directions: directionResult,
              }}
            />
          )}

          {markers.map((marker) => (
            <CustomMarker key={JSON.stringify(marker.position)} {...marker} />
          ))}

          {routesToPlot.map((route) => (
            <PlotRoute key={route.path.toString()} {...route} />
          ))}

          {actionMode === ACTION_TYPES.DRAWING_RECTANGLE ? (
            <DrawingManager
              drawingMode={
                actionMode === ACTION_TYPES.DRAWING_RECTANGLE
                  ? google.maps.drawing.OverlayType.RECTANGLE
                  : null
              }
              onRectangleComplete={onDrawRectangle}
              options={{
                rectangleOptions: {
                  editable: true,
                  draggable: true,
                  strokeColor: "#008000",
                  fillColor: "#008000",
                },
              }}
            />
          ) : null}
        </GoogleMap>
      )}
    </>
  );
};

export default MapComponent;
