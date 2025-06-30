import { LAT_LNG_TYPE } from "@/types";
import { Marker } from "@react-google-maps/api";
import React from "react";

export type MARKER_PROP_TYPE = {
  label: string;
  position: LAT_LNG_TYPE;
  draggable?: boolean;
  onDragEnd?: (e: google.maps.MapMouseEvent) => void;
};

const CustomMarker: React.FC<MARKER_PROP_TYPE> = ({
  position,
  label,
  onDragEnd,
  draggable,
}) => {
  // [FIX]! fix type from esp32

  let pos = position;
  if (typeof pos.lat === "string") {
    pos = {
      // @ts-expect-error: WIll fix type later on esp32 hardware code
      lat: parseFloat(position.lat),
      // @ts-expect-error: WIll fix type later on esp32 hardware code
      lng: parseFloat(position.lng),
    };
  }

  console.log("HEYYY 443434", position, pos);
  return (
    <Marker
      position={pos}
      label={{
        text: label,
        className: "absolute top-[15px] right-2/4 translate-x-2/4 font-bold",
      }}
      draggable={draggable}
      onDragEnd={onDragEnd}
    />
  );
};

export default CustomMarker;
