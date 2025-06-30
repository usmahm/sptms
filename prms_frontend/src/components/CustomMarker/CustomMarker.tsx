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
}) => (
  <Marker
    position={position}
    label={{
      text: label,
      className: "absolute top-[15px] right-2/4 translate-x-2/4 font-bold",
    }}
    draggable={draggable}
    onDragEnd={onDragEnd}
  />
);

export default CustomMarker;
