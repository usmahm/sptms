"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  DirectionsRenderer,
  DirectionsService,
  GoogleMap,
  // LoadScript,
  Marker,
  Polyline,
  useJsApiLoader,
} from "@react-google-maps/api";
import { toast } from "react-toastify";
import {
  addDoc,
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { firebaseDb } from "@/utils/firebase";
import PlotRoute from "@/components/PlotRoute/PlotRoute";

const containerStyle = {
  width: "100%",
  height: "100%",
  flex: 1,
};

const center = {
  lat: 7.501217,
  lng: 4.502154,
};

// const markerPosition = {
//   lat: 7.496612,
//   lng: 4.502287,
// };

// const dir = {
//   to: {
//     lat: 7.496612,
//     lng: 4.502287,
//   },
//   fro: {
//     lat: 7.519754,
//     lng: 4.521495,
//   },
// };

enum PICKING_ID {
  ORIGIN,
  DESTINATION,
}

type LAT_LNG_TYPE = {
  lat: number;
  lng: number;
};
type DESIRED_TRIP_TYPE = {
  to?: LAT_LNG_TYPE;
  fro?: LAT_LNG_TYPE;
};

type ROUTE_PLOT_STATUS = {
  ACTUAL: boolean;
  EXPECTED: boolean;
};

const Button = ({
  onClick,
  label,
  disabled,
  mode = "OUTLINE",
}: {
  onClick: () => void;
  label: string;
  mode?: "FILL" | "OUTLINE";
  disabled?: boolean;
}) => (
  <button
    className={`px-5 py-3 rounded-xl border-2 cursor-pointer font-bold border-black 
      ${mode === "OUTLINE" ? "text-black" : "text-white bg-black"} 
      ${disabled && "opacity-30"}
    `}
    onClick={onClick}
    disabled={disabled}
  >
    {label}
  </button>
);

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

const tripId = "Kd0yo2TYAKy1yVkqKPk1";

const pathOptions = {
  strokeColor: "#FF0000",
  strokeOpacity: 1.0,
  strokeWeight: 5,
};

function Home() {
  const [pickingId, setPickingId] = useState<PICKING_ID | null>(null);
  const [desiredTrip, setDesiredTrip] = useState<DESIRED_TRIP_TYPE>({});
  const [isDirectionServiceActivated, setIsDirectionServiceActivated] =
    useState(false);

  const [loadingRoute, setLoadingRoute] = useState(false);
  const [submitingTripRoute, setSubmitingTripRoute] = useState(false);

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [response, setResponse] = useState<google.maps.DirectionsResult | null>(
    null
  );

  const [expectedRouteData, setExpectedRouteData] = useState<
    LAT_LNG_TYPE[] | null
  >(null);
  const [actualRouteData, setActualRouteData] = useState<LAT_LNG_TYPE[] | null>(
    null
  );

  const [routedistDur, setRoutedistDur] = useState<{
    distance: string;
    duration: string;
  } | null>(null);

  const [routePlotStatus, setRoutePlotStatus] = useState<ROUTE_PLOT_STATUS>({
    ACTUAL: true,
    EXPECTED: true,
  });

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(_: google.maps.Map) {
    setMap(null);
  }, []);

  const directionsCallback = useCallback(function (
    res: google.maps.DirectionsResult | null,
    status: google.maps.DirectionsStatus
  ) {
    console.log("HYEYYY 111", res);

    const routePath = res?.routes[0].overview_path.map((r) => r.toJSON());
    console.log("HEYYY 222", routePath);

    if (res !== null) {
      if (status === "OK") {
        setResponse(res);

        // [FIX]!: temporary hack
        setRoutedistDur({
          distance: res.routes[0].legs[0].distance.text,
          duration: res.routes[0].legs[0].duration.text,
        });
      } else {
        console.log("response: ", res);
      }

      setIsDirectionServiceActivated(false);
      setDesiredTrip({});
      setLoadingRoute(false);
    }
  },
  []);

  const mapClickHandler = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (pickingId !== null) {
        setDesiredTrip((curVal) => ({
          fro:
            pickingId === PICKING_ID.ORIGIN ? e.latLng?.toJSON() : curVal.fro,
          to:
            pickingId === PICKING_ID.DESTINATION
              ? e.latLng?.toJSON()
              : curVal.to,
        }));

        setPickingId(null);
      }
    },
    [pickingId]
  );

  const markerDragHandler = useCallback(
    (e: google.maps.MapMouseEvent, markerId: PICKING_ID) => {
      setDesiredTrip((curVal) => ({
        fro: markerId === PICKING_ID.ORIGIN ? e.latLng?.toJSON() : curVal.fro,
        to:
          markerId === PICKING_ID.DESTINATION ? e.latLng?.toJSON() : curVal.to,
      }));
    },
    []
  );

  const fetchRouteHandler = () => {
    if (desiredTrip.to && desiredTrip.fro) {
      setLoadingRoute(true);
      setIsDirectionServiceActivated(true);
    } else {
      toast.error("Please select trip origin and destination!");
    }
  };

  const pickBtnClickHandler = (pId: PICKING_ID) => {
    if (response) {
      setResponse(null);
    }
    setPickingId(pId);
  };

  const tripRouteSubmitHandler = async () => {
    setSubmitingTripRoute(true);

    try {
      if (response) {
        const routePath = response.routes[0].overview_path.map((r) =>
          r.toJSON()
        );

        const docData = {
          expected_path: routePath,
        };

        const respo = await setDoc(doc(firebaseDb, "trips", tripId), docData, {
          merge: true,
        });

        console.log("HEYYY 666", respo);
        toast.success("New trip route submitted!");
      }
    } catch (err) {
      console.log("HEYYYY ERR111", err);
    } finally {
      setSubmitingTripRoute(false);
    }
  };

  const toggleRoutePlotStatus = (routeId: "ACTUAL" | "EXPECTED") => {
    setRoutePlotStatus((prev) => ({
      ACTUAL: routeId === "ACTUAL" ? !prev.ACTUAL : prev.ACTUAL,
      EXPECTED: routeId === "EXPECTED" ? !prev.EXPECTED : prev.EXPECTED,
    }));
  };

  useEffect(() => {
    const call = async () => {
      try {
        const tripRef = doc(firebaseDb, "trips", tripId);
        const docSnapshot = await getDoc(tripRef);

        if (docSnapshot.exists()) {
          const trip = {
            ...docSnapshot.data(),
            id: docSnapshot.id,
          };
          console.log("HEYYY 4444", trip);

          setExpectedRouteData(trip.expected_path);
          setActualRouteData(trip.actual_path);
        } else {
          toast.error("Trip doesn't exist!");
        }
      } catch (err) {
        console.log("HEYYYY ERR111", err);
      }
    };

    call();
  }, []);

  return (
    <>
      <div className="w-full h-screen bg-white flex flex-col py-4 px-10">
        <div className="mb-3 flex flex-row items-center justify-between">
          <div>
            <div className="flex items-center justify-center gap-x-2 mb-2">
              <Button
                onClick={() => pickBtnClickHandler(PICKING_ID.ORIGIN)}
                label="Pick Origin"
                mode={pickingId === PICKING_ID.ORIGIN ? "FILL" : "OUTLINE"}
              />
              <Button
                onClick={() => pickBtnClickHandler(PICKING_ID.DESTINATION)}
                label="Pick Destination"
                mode={pickingId === PICKING_ID.DESTINATION ? "FILL" : "OUTLINE"}
              />
              <Button
                onClick={fetchRouteHandler}
                label={!loadingRoute ? "Get Route" : "Loading..."}
                disabled={loadingRoute || !(desiredTrip.fro && desiredTrip.to)}
                // mode={pickingId === PICKING_ID.ORIGIN ? "FILL" : "OUTLINE"}
              />
              <Button
                onClick={tripRouteSubmitHandler}
                label={!submitingTripRoute ? "Submit Trip Route" : "Loading..."}
                disabled={submitingTripRoute || !response}
                // mode={pickingId === PICKING_ID.ORIGIN ? "FILL" : "OUTLINE"}
              />
            </div>
            {actualRouteData && expectedRouteData && (
              <div className="flex items-center justify-center gap-x-2 mb-2">
                <Button
                  onClick={() => toggleRoutePlotStatus("ACTUAL")}
                  label="Show/Hide Actual Route"
                  mode={routePlotStatus.ACTUAL ? "FILL" : "OUTLINE"}
                />
                <Button
                  onClick={() => toggleRoutePlotStatus("EXPECTED")}
                  label="Show/Hide Expected Route"
                  mode={routePlotStatus.EXPECTED ? "FILL" : "OUTLINE"}
                />
              </div>
            )}
          </div>
          <div>
            {routedistDur && (
              <>
                <h2 className="text-black text-right">Route Details</h2>
                <p className="text-black text-right">
                  Distance: {routedistDur?.distance}
                </p>
                <p className="text-black text-right">
                  Duration: {routedistDur?.duration}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="flex-1 flex-grow rounded-xl border-2 border-black overflow-hidden">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={10}
              onLoad={onLoad}
              onUnmount={onUnmount}
              onClick={mapClickHandler}
            >
              {/* Child components, such as markers, info windows, etc. */}
              {response === null &&
                isDirectionServiceActivated &&
                desiredTrip.to &&
                desiredTrip.fro && (
                  <DirectionsService
                    options={{
                      destination: desiredTrip.to,
                      origin: desiredTrip.fro,
                      // @ts-ignore
                      travelMode: "DRIVING",
                    }}
                    // onLoad={(directionsService) => {
                    //   console.log(
                    //     "DirectionsService onLoad directionsService: ",
                    //     directionsService
                    //   );
                    // }}
                    // onUnmount={(directionsService) => {
                    //   console.log(
                    //     "DirectionsService onUnmount directionsService: ",
                    //     directionsService
                    //   );
                    // }}
                    callback={directionsCallback}
                  />
                )}

              {response !== null && (
                <DirectionsRenderer
                  options={{
                    directions: response,
                  }}
                  // optional
                  onLoad={(
                    directionsRenderer: google.maps.DirectionsRenderer
                  ) => {
                    console.log(
                      "DirectionsRenderer onLoad directionsRenderer: ",
                      directionsRenderer
                    );
                  }}
                  // optional
                  onUnmount={(
                    directionsRenderer: google.maps.DirectionsRenderer
                  ) => {
                    console.log(
                      "DirectionsRenderer onUnmount directionsRenderer: ",
                      directionsRenderer
                    );
                  }}
                />
              )}

              {desiredTrip.fro && (
                <CustomMarker
                  label="Origin"
                  position={desiredTrip.fro}
                  onDragEnd={(e) => markerDragHandler(e, PICKING_ID.ORIGIN)}
                />
              )}
              {desiredTrip.to && (
                <CustomMarker
                  label="Destination"
                  position={desiredTrip.to}
                  onDragEnd={(e) => markerDragHandler(e, PICKING_ID.ORIGIN)}
                />
              )}

              {expectedRouteData && (
                <PlotRoute
                  originLocation={expectedRouteData[0]}
                  destinationLocation={
                    expectedRouteData[expectedRouteData.length - 1]
                  }
                  path={expectedRouteData}
                  visible={routePlotStatus.EXPECTED}
                />
              )}

              {actualRouteData && (
                <PlotRoute
                  originLocation={actualRouteData[0]}
                  destinationLocation={
                    actualRouteData[actualRouteData.length - 1]
                  }
                  path={actualRouteData}
                  color="#008000"
                  visible={routePlotStatus.ACTUAL}
                  originLabel="Actual Origin"
                  destinationLabel="Current Postion"
                />
              )}
            </GoogleMap>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
}

export default React.memo(Home);
