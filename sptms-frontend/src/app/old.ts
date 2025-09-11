  // useEffect(() => {
  //   const call = async () => {
  //     try {
  //       // const qSnapshot = await getDocs(collection(firebaseDb, "trips"));
  //       // console.log("HEYY qSnapshot", qSnapshot);
  //       // const filteredData = qSnapshot.docs.map((doc) => ({
  //       //   ...doc.data(),
  //       //   id: doc.id,
  //       // }));
  //       // console.log("HWEYYYY 4434", filteredData);

  //       // const tripsRef = collection(firebaseDb, "trips");
  //       // const q = query(tripsRef, where(documentId(), "==", tripId));

  //       const tripRef = doc(firebaseDb, "trips", tripId);
  //       const docSnapshot = await getDoc(tripRef);

  //       if (docSnapshot.exists()) {
  //         const trip = {
  //           ...docSnapshot.data(),
  //           id: docSnapshot.id,
  //         };
  //         console.log("HEYYY 4444", trip);

  //         setExpectedRouteData(trip.expected_path);
  //         setActualRouteData(trip.actual_path);
  //       } else {
  //         toast.error("Trip doesn't exist!");
  //       }
  //       // const trip = querySnapshot.docs.map((doc) => ({
  //       //   ...doc.data(),
  //       //   id: doc.id,
  //       // }));

  //       // const data = {
  //       //   actual_arrival_time: "2025-05-21T06:34:16.255Z",
  //       //   actual_path: [
  //       //     {
  //       //       lng: 4.502287,
  //       //       lat: 7.496612,
  //       //     },
  //       //   ],
  //       //   end_bus_stop: "bus_stops/ywsxbQz3A4dbvgTJLNjs",
  //       //   scheduled_arrival_time: "2025-05-21T06:31:39.274Z",
  //       //   start_bus_stop: "bus_stops/J9EDTZbBvhHxNM6JunYM",
  //       //   expected_path: [
  //       //     {
  //       //       lng: 4.502287,
  //       //       lat: 7.496612,
  //       //     },
  //       //   ],
  //       //   route_name: "New Name",
  //       //   actual_departure_time: "2025-05-21T04:33:59.111Z",
  //       //   bus_node_id: "bus_nodes/Jer596MeULr2dJZ3YrAQ",
  //       //   distance: 1000.99,
  //       //   scheduled_departure_time: "2025-05-21T04:31:17.328Z",
  //       // };

  //       // const docRef = await addDoc(tripsRef, data);
  //       // console.log("HEYYYY 3232", docRef);
  //     } catch (err) {
  //       console.log("HEYYYY ERR111", err);
  //     }
  //   };

  //   call();
  // }, []);


// const docData = {
//   actual_arrival_time: {
//     timestampValue: "2025-05-21T06:34:16.255Z",
//   },
//   actual_path: {
//     arrayValue: {
//       values: [
//         {
//           mapValue: {
//             fields: {
//               lng: {
//                 doubleValue: 4.502287,
//               },
//               lat: {
//                 doubleValue: 7.496612,
//               },
//             },
//           },
//         },
//       ],
//     },
//   },
//   end_bus_stop: {
//     referenceValue:
//       "projects/prms-oau/databases/(default)/documents/trips/ywsxbQz3A4dbvgTJLNjs",
//   },
//   scheduled_arrival_time: {
//     timestampValue: "2025-05-21T06:31:39.274Z",
//   },
//   start_bus_stop: {
//     referenceValue:
//       "projects/prms-oau/databases/(default)/documents/trips/J9EDTZbBvhHxNM6JunYM",
//   },
//   expected_path: {
//     arrayValue: {
//       values: [
//         {
//           mapValue: {
//             fields: {
//               lat: {
//                 doubleValue: 7.496612,
//               },
//               lng: {
//                 doubleValue: 4.502287,
//               },
//             },
//           },
//         },
//       ],
//     },
//   },
//   route_name: {
//     stringValue: "New Name",
//   },
//   actual_departure_time: {
//     timestampValue: "2025-05-21T04:33:59.111Z",
//   },
//   bus_node_id: {
//     referenceValue:
//       "projects/prms-oau/databases/(default)/documents/bus_nodes/Jer596MeULr2dJZ3YrAQ",
//   },
//   distance: {
//     doubleValue: 1000.99,
//   },
//   scheduled_departure_time: {
//     timestampValue: "2025-05-21T04:31:17.328Z",
//   },
// };