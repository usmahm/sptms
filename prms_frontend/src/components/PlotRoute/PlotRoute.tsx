import { Polyline } from "@react-google-maps/api";
import React from "react";
import CustomMarker from "../CustomMarker/CustomMarker";
import { LAT_LNG_TYPE } from "@/types";

let count = 0;

export type PLOT_ROUTE_TYPE = {
  origin: LAT_LNG_TYPE;
  destination: LAT_LNG_TYPE;
  path: LAT_LNG_TYPE[];
  color?: string;
  originLabel?: string;
  destinationLabel?: string;
  visible: boolean;
};

const PlotRoute: React.FC<PLOT_ROUTE_TYPE> = ({
  origin,
  destination,
  path,
  visible,
  color = "#FF0000",
  originLabel = "Origin Bus Stop",
  destinationLabel = "Destination Bus Stop",
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
            position={origin}
            draggable={false}
          />
          <CustomMarker
            label={destinationLabel}
            position={destination}
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
