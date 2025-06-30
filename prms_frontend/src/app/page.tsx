"use client";

import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { PLOT_ROUTE_TYPE } from "@/components/PlotRoute/PlotRoute";
import Button from "@/components/UI/Button/Button";
import MapComponent, {
  ACTION_TYPES,
} from "@/components/MapComponent/MapComponent";
import { MARKER_PROP_TYPE } from "@/components/CustomMarker/CustomMarker";
import { DESIRED_TRIP_TYPE, LAT_LNG_TYPE } from "@/types";
import { getTripById } from "@/api/firebaseQueries";
import { createBusStop, createTrip } from "@/api/firebaseMutations";

const center = {
  lat: 7.501217,
  lng: 4.502154,
};

enum EDITING_ID {
  ORIGIN,
  DESTINATION,
  NEW_BUS_STOP,
  GEOFENCE,
}

type ROUTE_PLOT_DISPLAY_STATUS = {
  ACTUAL: boolean;
  EXPECTED: boolean;
};

const tripId = "Kd0yo2TYAKy1yVkqKPk1";

function Home() {
  const [editingId, setEditingId] = useState<EDITING_ID | null>(null);
  const [desiredTrip, setDesiredTrip] = useState<DESIRED_TRIP_TYPE>({});
  const [newBusStop, setNewBusStop] = useState<LAT_LNG_TYPE | null>(null);

  const [loadingRoute, setLoadingRoute] = useState(false);
  const [submitingTripRoute, setSubmitingTripRoute] = useState(false);
  const [submitingNewBusStop, setSubmitingNewBusStop] = useState(false);

  const [fetchedRoute, setFetchedRoute] = useState<
    google.maps.DirectionsResult | undefined
  >(undefined);

  const [expectedRouteData, setExpectedRouteData] = useState<
    LAT_LNG_TYPE[] | null
  >(null);
  const [actualRouteData, setActualRouteData] = useState<LAT_LNG_TYPE[] | null>(
    null
  );
  // const [busStops, setbusStops] = useState<BUS_STOP_TYPE[] | null>(null);

  const [routedistDur, setRoutedistDur] = useState<{
    distance: string;
    duration: string;
  } | null>(null);

  const [routePlotStatus, setRoutePlotStatus] =
    useState<ROUTE_PLOT_DISPLAY_STATUS>({
      ACTUAL: true,
      EXPECTED: true,
    });

  const directionsCallback = useCallback(function (
    res: google.maps.DirectionsResult | null
  ) {
    console.log("HYEYYY 111", res);

    const routePath = res?.routes[0].overview_path.map((r) => r.toJSON());
    console.log("HEYYY 222", routePath);

    if (res !== null) {
      setFetchedRoute(res);

      if (
        res?.routes &&
        res.routes[0].legs &&
        res.routes[0].legs[0].distance &&
        res.routes[0].legs[0].duration
      ) {
        // [FIX]!: temporary hack
        setRoutedistDur({
          distance: res.routes[0].legs[0].distance.text,
          duration: res.routes[0].legs[0].duration.text,
        });
      }

      setDesiredTrip({});
      setLoadingRoute(false);
    }
  },
  []);

  // To handle selected points on the map
  const mapClickHandler = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (editingId === null || !e.latLng) return;

      const latLng = e.latLng.toJSON();

      if (
        editingId === EDITING_ID.ORIGIN ||
        editingId === EDITING_ID.DESTINATION
      ) {
        setDesiredTrip((curVal) => ({
          fro: editingId === EDITING_ID.ORIGIN ? latLng : curVal.fro,
          to: editingId === EDITING_ID.DESTINATION ? latLng : curVal.to,
        }));
      } else if (editingId === EDITING_ID.NEW_BUS_STOP) {
        setNewBusStop(latLng);
      }

      setEditingId(null);
    },
    [editingId]
  );

  const markerDragHandler = useCallback(
    (e: google.maps.MapMouseEvent, markerId: EDITING_ID) => {
      if (editingId === null || !e.latLng) return;

      const latLng = e.latLng.toJSON();

      if (
        editingId === EDITING_ID.ORIGIN ||
        editingId === EDITING_ID.DESTINATION
      ) {
        setDesiredTrip((curVal) => ({
          fro: markerId === EDITING_ID.ORIGIN ? latLng : curVal.fro,
          to: markerId === EDITING_ID.DESTINATION ? latLng : curVal.to,
        }));
      } else if (editingId === EDITING_ID.NEW_BUS_STOP && e.latLng) {
        setNewBusStop(latLng);
      }
    },
    [editingId]
  );

  const fetchRouteHandler = async () => {
    if (desiredTrip.to && desiredTrip.fro) {
      setLoadingRoute(true);

      const directionService = new google.maps.DirectionsService();

      const directionResult = await directionService.route({
        origin: desiredTrip.fro,
        destination: desiredTrip.to,
        travelMode: google.maps.TravelMode.DRIVING,
      });

      console.log("HEYYY 333", directionResult);

      // @ts-expect-error: this library's type definition is not completely correct
      if (directionResult.status === "OK") {
        directionsCallback(directionResult);
      } else {
        toast.error("Error fetching route!");
      }
    } else {
      toast.error("Please select trip origin and destination!");
    }
  };

  const pickBtnClickHandler = (pId: EDITING_ID) => {
    if (
      (editingId === EDITING_ID.ORIGIN ||
        editingId === EDITING_ID.DESTINATION) &&
      fetchedRoute
    ) {
      setFetchedRoute(undefined);
    }

    if (pId === editingId) {
      setEditingId(null);
    } else {
      setEditingId(pId);
    }
  };

  const tripRouteSubmitHandler = async () => {
    setSubmitingTripRoute(true);

    try {
      if (fetchedRoute) {
        const routePath = fetchedRoute.routes[0].overview_path.map((r) =>
          r.toJSON()
        );

        const tripRoute = {
          expected_path: routePath,
        };

        await createTrip(tripId, tripRoute);

        toast.success("New trip route submitted!");
      }
    } catch (err) {
      console.log("HEYYYY ERR111", err);
    } finally {
      setSubmitingTripRoute(false);
    }
  };

  // delete later
  function makeid(length: number) {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  const newBusStopSubmitHandler = async () => {
    console.log("HEYYYEYEYE");
    setSubmitingNewBusStop(true);

    try {
      if (newBusStop) {
        const docData = {
          location: newBusStop,
          name: makeid(5),
        };

        await createBusStop(docData);

        toast.success("New bus stop submitted!");
      }
    } catch (err) {
      console.log("HEYYYY ERR111", err);
    } finally {
      setSubmitingNewBusStop(false);
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
      const trip = await getTripById(tripId);

      console.log("HEYYY 4444", trip);
      if (trip) {
        setExpectedRouteData(trip.expected_path);
        setActualRouteData(trip.actual_path);
      } else {
        toast.error("Trip doesn't exist!");
      }
    };

    call();
  }, []);

  const getAllMarkersToRender = () => {
    const markers: MARKER_PROP_TYPE[] = [];

    if (desiredTrip.fro) {
      markers.push({
        label: "Origin",
        position: desiredTrip.fro,
        onDragEnd: (e) => markerDragHandler(e, EDITING_ID.ORIGIN),
      });
    }
    if (desiredTrip.to) {
      markers.push({
        label: "Destination",
        position: desiredTrip.to,
        onDragEnd: (e) => markerDragHandler(e, EDITING_ID.DESTINATION),
      });
    }
    if (newBusStop) {
      markers.push({
        label: "New Bus Stop",
        position: newBusStop,
        onDragEnd: (e) => markerDragHandler(e, EDITING_ID.NEW_BUS_STOP),
      });
    }

    return markers;
  };

  const getAllRoutesToPlot = () => {
    const routesToPlot: PLOT_ROUTE_TYPE[] = [];

    if (expectedRouteData) {
      routesToPlot.push({
        origin: expectedRouteData[0],
        originLabel: "Origin",
        destination: expectedRouteData[expectedRouteData.length - 1],
        destinationLabel: "Destination",
        path: expectedRouteData,
        color: "#FF0000",
        visible: routePlotStatus.EXPECTED,
      });
    }

    if (actualRouteData) {
      routesToPlot.push({
        origin: actualRouteData[0],
        originLabel: "Actual Origin",
        destination: actualRouteData[actualRouteData.length - 1],
        destinationLabel: "Current Postion",
        path: actualRouteData,
        color: "#008000",
        visible: routePlotStatus.ACTUAL,
      });
    }

    return routesToPlot;
  };

  const getActionMode = (): ACTION_TYPES | undefined => {
    let actionMode: ACTION_TYPES | undefined = undefined;

    switch (editingId) {
      case EDITING_ID.ORIGIN:
        actionMode = ACTION_TYPES.SELECT_POINT;
        break;
      case EDITING_ID.DESTINATION:
        actionMode = ACTION_TYPES.SELECT_POINT;
        break;
      case EDITING_ID.NEW_BUS_STOP:
        actionMode = ACTION_TYPES.SELECT_POINT;
        break;
      case EDITING_ID.GEOFENCE:
        actionMode = ACTION_TYPES.DRAWING_RECTANGLE;
        break;
      default:
        break;
    }

    console.log("HEYYY 777", actionMode);

    return actionMode;
  };

  const markers: MARKER_PROP_TYPE[] = getAllMarkersToRender();
  const routesToPlot: PLOT_ROUTE_TYPE[] = getAllRoutesToPlot();
  const actionMode = getActionMode();
  return (
    <>
      <div className="w-full h-screen bg-white flex flex-col py-4 px-10">
        <div className="mb-3 flex flex-row items-center justify-between">
          <div>
            <div className="flex items-center justify-center gap-x-2 mb-2">
              <Button
                onClick={() => pickBtnClickHandler(EDITING_ID.ORIGIN)}
                label="Pick Origin"
                mode={editingId === EDITING_ID.ORIGIN ? "FILL" : "OUTLINE"}
              />
              <Button
                onClick={() => pickBtnClickHandler(EDITING_ID.DESTINATION)}
                label="Pick Destination"
                mode={editingId === EDITING_ID.DESTINATION ? "FILL" : "OUTLINE"}
              />
              <Button
                onClick={fetchRouteHandler}
                label={!loadingRoute ? "Get Route" : "Loading..."}
                disabled={loadingRoute || !(desiredTrip.fro && desiredTrip.to)}
              />
              <Button
                onClick={tripRouteSubmitHandler}
                label={!submitingTripRoute ? "Submit Trip Route" : "Loading..."}
                disabled={submitingTripRoute || !fetchedRoute}
              />
            </div>
            <div className="flex items-center justify-center gap-x-2 mb-2">
              <Button
                onClick={() => pickBtnClickHandler(EDITING_ID.GEOFENCE)}
                label="Draw Geofence"
                mode={
                  editingId === EDITING_ID.NEW_BUS_STOP ? "FILL" : "OUTLINE"
                }
              />
              <Button
                onClick={() => pickBtnClickHandler(EDITING_ID.NEW_BUS_STOP)}
                label="Pick New Bus Stop"
                mode={
                  editingId === EDITING_ID.NEW_BUS_STOP ? "FILL" : "OUTLINE"
                }
              />
              <Button
                onClick={newBusStopSubmitHandler}
                label={!submitingNewBusStop ? "Create Bus Stop" : "Loading..."}
                disabled={submitingNewBusStop || !newBusStop}
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
          <MapComponent
            center={center}
            actionMode={actionMode}
            onSelectPoint={mapClickHandler}
            directionResult={fetchedRoute}
            markers={markers}
            routesToPlot={routesToPlot}
            onDrawRectangle={(rec) => {
              const res = rec.getBounds();
              if (res) {
                console.log(
                  "HEYYY 111",
                  res,
                  // res.contains(),
                  res.getCenter().toJSON(),
                  res.getNorthEast()
                );
              }
            }}
          />
        </div>
      </div>
    </>
  );
}

export default React.memo(Home);
