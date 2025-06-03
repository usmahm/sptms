import { Marker, Polyline } from "@react-google-maps/api";
import React from "react";

const CustomMarker = ({
  position,
  label,
  onDragEnd,
  draggable,
}: {
  position: LAT_LNG_TYPE;
  label: string;
  draggable?: boolean;
  onDragEnd?: (e: google.maps.MapMouseEvent) => void;
}) => (
  <Marker
    // onLoad={onLoadMarker}
    position={position}
    label={{
      text: label,
      className: "absolute top-[15px] right-2/4 translate-x-2/4 font-bold",
    }}
    draggable={draggable}
    onDragEnd={onDragEnd}
  />
);

type LAT_LNG_TYPE = {
  lat: number;
  lng: number;
};

let count = 0;

const PlotRoute = ({
  originLocation,
  destinationLocation,
  path,
  visible,
  color = "#FF0000",
  originLabel = "Origin Bus Stop",
  destinationLabel = "Destination Bus Stop",
}: {
  originLocation: LAT_LNG_TYPE;
  destinationLocation: LAT_LNG_TYPE;
  path: LAT_LNG_TYPE[];
  color?: string;
  originLabel?: string;
  destinationLabel?: string;
  visible: boolean;
}) => {
  const pathOptions = {
    strokeColor: color,
    strokeOpacity: 1.0,
    strokeWeight: 5,
  };

  console.log("RENDERING " + count, path);
  count = count + 1;

  return (
    <>
      {visible && (
        <>
          <CustomMarker
            label={originLabel}
            position={originLocation}
            draggable={false}
          />
          <CustomMarker
            label={destinationLabel}
            position={destinationLocation}
            draggable={false}
          />
        </>
      )}
      <Polyline
        path={visible ? path : []}
        options={pathOptions}
        visible={visible}
      />
    </>
  );
};

export default PlotRoute;
